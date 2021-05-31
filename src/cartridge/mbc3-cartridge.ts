import { Cartridge } from "@/cartridge/cartridge";

export class Mbc3Cartridge extends Cartridge {
  private romBank = 0;
  private isRamEnabled = false;
  private ramDataView: DataView;
  private ramBytes: Uint8Array;
  private isRamOverRtc = false;
  private ramBank = 0;

  constructor(gameDataView: DataView) {
    super(gameDataView);
    this.ramDataView = new DataView(new ArrayBuffer(this.ramSize));
    this.ramBytes = new Uint8Array(this.ramDataView.buffer);
    this.ramBytes.fill(0xff);
  }

  override writeByte(address: number, value: number) {
    if (this.isRamGate(address)) {
      this.isRamEnabled = value === 0x0a;
    } else if (this.isRomBank(address)) {
      if (value === 0) {
        this.romBank = 1;
      }

      const maskedBank = value & 0x7f;
      this.romBank = maskedBank;
    } else if (this.isRamBank(address)) {
      if (value <= 0x03) {
        this.isRamOverRtc = true;
        this.ramBank = value;
      }

      if (value >= 0x08 && value <= 0xc) {
        this.isRamOverRtc = false;
      }
    } else if (address >= 0xa000 && address <= 0xbfff) {
      if (!this.isRamEnabled) {
        return;
      }

      if (this.isRamOverRtc) {
        const offsetIntoRam = 0x2000 * this.ramBank;
        const addressInRam = (address - 0xa000) + offsetIntoRam;
        this.ramDataView.setUint8(addressInRam, value);
      }
    }
  }

  override writeWord(address: number, value: number) {
    if (this.isRamGate(address)) {
      this.isRamEnabled = value === 0x0a;
    } else if (this.isRomBank(address)) {
      if (value === 0) {
        this.romBank = 1;
      }

      const maskedBank = value & 0x7f;
      this.romBank = maskedBank;
    } else if (this.isRamBank(address)) {
      if (value <= 0x03) {
        this.isRamOverRtc = true;
        this.ramBank = value;
      }

      if (value >= 0x08 && value <= 0xc) {
        this.isRamOverRtc = false;
      }
    } else if (address >= 0xa000 && address <= 0xbfff) {
      if (!this.isRamEnabled) {
        return;
      }

      if (this.isRamOverRtc) {
        const offsetIntoRam = 0x2000 * this.ramBank;
        const addressInRam = (address - 0xa000) + offsetIntoRam;
        this.ramDataView.setUint16(addressInRam, value, true);
      }
    }
  }

  override readByte(address: number): number {
    if (address >= 0x0000 && address <= 0x3fff) {
      return super.readByte(address);
    }

    if (address >= 0x4000 && address <= 0x7fff) {
      const addressIntoBank = address - 0x4000;
      const bankOffset = 0x4000 * this.romBank;
      const addressInRom = bankOffset + addressIntoBank;
      return super.readByte(addressInRom);
    }

    if (this.isRam(address)) {
      const offsetIntoRam = 0x2000 * this.ramBank;
      const addressInRam = (address - 0xa000) + offsetIntoRam;
      return super.readByte(addressInRam);
    }

    console.error('shouldnt ever be here');
    return super.readByte(address);
  }

  override readSignedByte(address: number): number {
    if (address >= 0x0000 && address <= 0x3fff) {
      return super.readByte(address);
    }

    if (address >= 0x4000 && address <= 0x7fff) {
      const addressIntoBank = address - 0x4000;
      const bankOffset = 0x4000 * this.romBank;
      const addressInRom = bankOffset + addressIntoBank;
      return super.readByte(addressInRom);
    }

    if (this.isRam(address)) {
      const offsetIntoRam = 0x2000 * this.ramBank;
      const addressInRam = (address - 0xa000) + offsetIntoRam;
      return super.readByte(addressInRam);
    }

    console.error('shouldnt ever be here');
    return super.readByte(address);
  }

  override readWord(address: number): number {
    if (address >= 0x0000 && address <= 0x3fff) {
      return super.readWord(address);
    }

    if (address >= 0x4000 && address <= 0x7fff) {
      const addressIntoBank = address - 0x4000;
      const bankOffset = 0x4000 * this.romBank;
      const addressInRom = bankOffset + addressIntoBank;
      return super.readWord(addressInRom);
    }

    if (this.isRam(address)) {
      const offsetIntoRam = 0x2000 * this.ramBank;
      const addressInRam = (address - 0xa000) + offsetIntoRam;
      return super.readWord(addressInRam);
    }

    console.error('shouldnt ever be here');
    return super.readWord(address);
  }

  isRamGate(address: number) {
    return address >= 0x0000 && address <= 0x1fff;
  }

  isRomBank(address: number) {
    return address >= 0x2000 && address <= 0x3fff;
  }

  isRamBank(address: number) {
    return address >= 0x4000 && address <= 0x5fff;
  }

  private isRam(address: number) {
    return address >= 0xa000 && address <= 0xbfff;
  }
}