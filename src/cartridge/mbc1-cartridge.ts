import { Cartridge } from "@/cartridge/cartridge";
import { CartridgeType } from "@/cartridge/cartridge-type.enum";

enum Mbc1WriteType {
  RamGateRegister,
  Bank1Register,
  Bank2Register,
  ModeRegister,
  Sram
}

enum Mbc1ReadType {
  RomBankZero,
  RomBankZeroMode1,
  RomBank,
  Sram,
  Invalid
}

export class Mbc1Cartridge extends Cartridge {
  private isRamEnabled = false;
  private bank1 = 0b00001;
  private bank2 = 0b0;
  private mode = 0b0;
  private ramData: ArrayBuffer;
  private ramDataView: DataView;
  private ramBytes: Uint8Array;

  // Used to debounce calls to on sram write callback. Allows auto saving data without
  // hammering writes
  private writeTimeout: any;
  onSramWrite?: Function;

  constructor(gameDataView: DataView) {
    super(gameDataView);
    this.ramData = new ArrayBuffer(this.ramSize)
    this.ramDataView = new DataView(this.ramData);
    this.ramBytes = new Uint8Array(this.ramDataView.buffer);
    this.ramBytes.fill(0xff);
  }

  setRam(sramArrayBuffer: ArrayBuffer) {
    this.ramData = sramArrayBuffer;
    this.ramDataView = new DataView(this.ramData);
    this.ramBytes = new Uint8Array(this.ramDataView.buffer);
  }

  dumpRam(): ArrayBuffer {
    return this.ramDataView.buffer;
  }


  override writeByte(address: number, value: number) {
    const sramWrite = (address: number, value: number) => {
      this.ramDataView.setUint8(address, value);
      if (this.type === CartridgeType.MBC1_RAM_BATTERY && this.onSramWrite) {
        clearTimeout(this.writeTimeout);
        this.writeTimeout = setTimeout(() => this.onSramWrite!(this.ramData), 500);
      }
    }
    this.write(address, value, sramWrite);
  }

  override writeWord(address: number, value: number) {
    const sramWrite = (address: number, value: number) => {
      this.ramDataView.setUint16(address, value, true);
      if (this.type === CartridgeType.MBC1_RAM_BATTERY && this.onSramWrite) {
        clearTimeout(this.writeTimeout);
        this.writeTimeout = setTimeout(() => this.onSramWrite!(this.ramData), 500);
      }
    }
    this.write(address, value, sramWrite);
  }

  override readByte(address: number): number {
    const cartridgeRead = (address: number) => this.gameDataView.getUint8(address);
    const sramRead = (address: number) => this.ramDataView.getUint8(address);
    return this.read(address, cartridgeRead, sramRead);
  }

  override readSignedByte(address: number): number {
    const cartridgeRead = (address: number) => this.gameDataView.getInt8(address);
    const sramRead = (address: number) => this.ramDataView.getInt8(address);
    return this.read(address, cartridgeRead, sramRead);
  }

  override readWord(address: number): number {
    const cartridgeRead = (address: number) => this.gameDataView.getUint16(address, true);
    const sramRead = (address: number) => this.ramDataView.getUint16(address, true);
    return this.read(address, cartridgeRead, sramRead);
  }

  private read(address: number, readFromCartridge: Function, readFromSram: Function) {
    const maskedAddress = address & 0b11111111111111;

    if (address >= 0x0000 && address <= 0x3fff) {
      if (this.mode === 0) {
        return readFromCartridge(maskedAddress);
      } else {
        const bankNumber = this.bank2 << 5;
        const bankCorrectedAddress = (bankNumber << 14) + maskedAddress;
        const wrappedForSize = bankCorrectedAddress & (this.romSize - 1);
        return readFromCartridge(wrappedForSize);
      }
    } else if (address >= 0x4000 && address <= 0x7fff) {
      const bankNumber = (this.bank2 << 5) + this.bank1;
      const bankCorrectedAddress = (bankNumber << 14) + maskedAddress;
      const wrappedForSize = bankCorrectedAddress & (this.romSize - 1);
      return readFromCartridge(wrappedForSize);
    } else {
      if (!this.isRamEnabled) {
        return 0xff;
      }
      const maskedAddress = address & 0b1111111111111;
      if (this.mode === 0 || this.ramSize === 0x008000) {
        return readFromSram(maskedAddress);
      } else {
        const bankedAddress = (this.bank2 << 13) + maskedAddress;
        return readFromSram(bankedAddress);
      }
    }
  }

  private write(address: number, value: number, writeToSram: Function) {
    if (this.isRamGate(address)) {
      const valueToEnableRam = 0b1010;
      const lowerNibble = value & 0b1111;
      this.isRamEnabled = lowerNibble === valueToEnableRam;
    } else if (this.isBank1(address)) {
      const masked = value & 0b11111;
      this.bank1 = masked === 0 ? 1 : masked; // zero not allowed in bank 1
    } else if (this.isBank2(address)) {
      this.bank2 = value & 0b11;
    } else if (this.isMode(address)) {
      this.mode = value & 0b1;
    } else if (this.isRam(address) && this.isRamEnabled) {
      const maskedAddress = address & 0b1111111111111;
      if (this.mode === 0 || this.ramSize === 0x008000) {
        writeToSram(maskedAddress, value);
      } else {
        const bankedAddress = (this.bank2 << 13) + maskedAddress;
        writeToSram(bankedAddress, value);
      }
    }
  }


  private isRamGate(address: number) {
    return address >= 0x0000 && address <= 0x1fff;
  }

  private isBank1(address: number) {
    return address >= 0x2000 && address <= 0x3fff;
  }

  private isBank2(address: number) {
    return address >=0x4000 && address <= 0x5fff;
  }

  private isMode(address: number) {
    return address >= 0x6000 && address <= 0x7fff;
  }

  private isRam(address: number) {
    return address >= 0xa000 && address <= 0xbfff;
  }
}
