import { Cartridge } from "@/cartridge/cartridge";
import { CartridgeType } from "@/cartridge/cartridge-type.enum";

export class Mbc3Cartridge extends Cartridge {
  private romBank = 0b0;

  private isRamAndRtcEnabled = false;
  private ramBankOrRtcSelection = 0;

  private ramData: ArrayBuffer;
  private ramDataView: DataView;
  private ramBytes: Uint8Array;

  // Used to debounce calls to on sram write callback. Allows auto saving data without
  // hammering writes
  private writeTimeout: any;
  onSramWrite?: Function;

  //TODO: Implement debounced callback for saving
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
      if (this.type === CartridgeType.MBC3_RAM_BATTERY && this.onSramWrite) {
        clearTimeout(this.writeTimeout);
        this.writeTimeout = setTimeout(() => this.onSramWrite!(this.ramData), 500);
      }
    }
    this.write(address, value, sramWrite);
  }

  override writeWord(address: number, value: number) {
    const sramWrite = (address: number, value: number) => {
      this.ramDataView.setUint16(address, value, true);
      if (this.type === CartridgeType.MBC3_RAM_BATTERY && this.onSramWrite) {
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
    const maskedAddress = address & 0x3fff;

    if (address >= 0x0000 && address <= 0x3fff) {
      return readFromCartridge(address);
    } else if (address >= 0x4000 && address <= 0x7fff) {
      const bankNumber = this.romBank;
      const bankCorrectedAddress = (bankNumber << 14) + maskedAddress;
      const wrappedForSize = bankCorrectedAddress & (this.romSize - 1);
      return readFromCartridge(wrappedForSize);
    } else {
      // RAM or RTC
      if (!this.isRamAndRtcEnabled) {
        return 0xff;
      }

      if (this.ramBankOrRtcSelection <= 3) {
        const maskedAddress = address & 0x1fff;
        const bankedAddress = (this.ramBankOrRtcSelection << 13) + maskedAddress;
        return readFromSram(bankedAddress);
      }
    }
  }

  private write(address: number, value: number, writeToSram: Function) {
    if (this.isRamAndTimerGate(address)) {
      const valueToEnableRam = 0b1010;
      const lowerNibble = value & 0b1111;
      this.isRamAndRtcEnabled = lowerNibble === valueToEnableRam;
    } else if (this.isRomBank(address)) {
      const masked = value & 0b1111111;
      this.romBank = masked === 0 ? 1 : masked; // zero not allowed in bank 1
    } else if (this.isRamBankNumberOrRtcRegisterSelect(address)) {
      this.ramBankOrRtcSelection = value;
    } else if (this.isLatchClockData(address)) {
      console.log('not implemented');
    } else if (this.isRamBankOrRtcRegister(address)) {
      const maskedAddress = address & 0x1fff;

      if (this.ramBankOrRtcSelection <= 3) {
        const bankedAddress = (this.ramBankOrRtcSelection << 13) + maskedAddress;
        writeToSram(bankedAddress, value);
      }
    }
  }

  private isRamAndTimerGate(address: number) {
    return address >= 0x0000 && address <= 0x1fff;
  }

  private isRomBank(address: number) {
    return address >= 0x2000 && address <= 0x3fff;
  }

  private isRamBankNumberOrRtcRegisterSelect(address: number) {
    return address >=0x4000 && address <= 0x5fff;
  }

  private isLatchClockData(address: number) {
    return address >=0x6000 && address <= 0x7fff;
  }

  private isRamBankOrRtcRegister(address: number) {
    return address >=0xa000 && address <= 0xbfff;
  }
}