import { Cartridge } from "@/cartridge/cartridge";

export class Mbc1Cartridge extends Cartridge{
  private isRamEnabled = false;
  private bank1 = 0b00001;
  private bank2 = 0b0;
  private mode = 0b0;

  override writeByte(address: number, value: number) {
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
    } else if (this.isRam(address)) {
      if (this.isRamEnabled) {
        const maskedAddress = address & 0b1111111111111;

        if (this.mode === 0) {
          super.writeByte(0xa000 + maskedAddress, value);
        } else {
          const bankedAddress = (this.bank2 << 13) + maskedAddress;
          const adjusted = 0xa000 + bankedAddress;
          const wrapped = adjusted & (this.romSize - 1);
          super.writeByte(wrapped, value);
        }
      }
    }
  }

  override readByte(address: number): number {
    const maskedAddress = address & 0b11111111111111;

    if (address >= 0x0000 && address <= 0x3fff) {
      if (this.mode === 0) {
        return super.readByte(maskedAddress);
      } else {
        const bankNumber = this.bank2 << 5;
        const bankCorrectedAddress = (bankNumber << 14) + maskedAddress;
        const wrappedForSize = bankCorrectedAddress & (this.romSize - 1);
        return super.readByte(wrappedForSize);
      }
    } else if (address >= 0x4000 && address <= 0x7fff) {
      const bankNumber = (this.bank2 << 5) + this.bank1;
      const bankCorrectedAddress = (bankNumber << 14) + maskedAddress;
      const wrappedForSize = bankCorrectedAddress & (this.romSize - 1);
      return super.readByte(wrappedForSize);
    } else if (this.isRam(address)) {
      if (this.isRamEnabled) {
        const maskedAddress = address & 0b1111111111111;

        if (this.mode === 0) {
          const test = super.readByte(0xa000 + maskedAddress);
          return test;
        } else {
          const bankedAddress = (this.bank2 << 13) + maskedAddress;
          const adjusted = 0xa000 + bankedAddress;
          const wrapped = adjusted & (this.romSize - 1);
          const test = super.readByte(wrapped);
          return test;
        }
      }
    }
    return super.readByte(address);
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
