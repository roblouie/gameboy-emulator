import {Cartridge} from "@/cartridge/cartridge";

export class Mbc5Cartridge extends Cartridge {
    romBank = 1;
    ramBank = 0;
    isRamEnabled = false;
    bankCount: number;
    private ramBytes: Uint8Array;


    constructor(gameDataView: DataView) {
        super(gameDataView);
        this.bankCount = (this.gameBytes.length / 0x4000) | 0;
        this.ramBytes = new Uint8Array(new ArrayBuffer(this.ramSize));
    }

    readByte(address: number) {
        if (address < 0x4000) return this.gameBytes[address];

        const bank = this.romBank % this.bankCount;
        const offset = bank * 0x4000 + (address - 0x4000);

        if (address >= 0xA000 && address < 0xC000) {
            if (!this.isRamEnabled || this.ramBytes.length === 0) return 0xFF;
            const ramBankCount = this.ramBytes.length / 0x2000;
            const bank = this.ramBank % Math.max(1, ramBankCount);
            return this.ramBytes[bank * 0x2000 + (address - 0xA000)];
        }

        return this.gameBytes[offset];
    }

    writeByte(address: number, value: number) {
        if (address < 0x2000) {
            this.isRamEnabled = (value & 0x0F) === 0x0A;
        }

        else if (address < 0x3000) {
            this.romBank = (this.romBank & 0x100) | value;
        }

        else if (address < 0x4000) {
            this.romBank = (this.romBank & 0xFF) | ((value & 1) << 8);
        }

        else if (address < 0x6000) {
            this.ramBank = value & 0x0F;
        }

        else if (address >= 0xA000 && address < 0xC000) {
            if (!this.isRamEnabled || this.ramBytes.length === 0) return;
            const ramBankCount = this.ramBytes.length / 0x2000;
            const bank = this.ramBank % Math.max(1, ramBankCount);
            return this.ramBytes[bank * 0x2000 + (address - 0xA000)] = value;
        }


    }
}
