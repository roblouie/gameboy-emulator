import { CartridgeType } from "./cartridge-type.enum";
import { Mbc1Cartridge } from "@/cartridge/mbc1-cartridge";

export class Cartridge {
  static EntryPointOffset = 0x100;
  static TypesWithBatterySave = [
    CartridgeType.ROM_RAM_BATTERY,
    CartridgeType.MBC1_RAM_BATTERY,
    CartridgeType.MBC2_BATTERY,
    CartridgeType.MBC3_RAM_BATTERY,
  ]

  protected gameDataView: DataView;
  protected gameBytes: Uint8Array;

  constructor(gameDataView: DataView) {
    this.gameDataView = gameDataView;
    this.gameBytes = new Uint8Array(gameDataView.buffer);
  }

  readByte(address: number) {
    return this.gameDataView.getUint8(address);
  }

  readSignedByte(address: number) {
    return this.gameDataView.getInt8(address);
  }

  readWord(address: number) {
    return this.gameDataView.getUint16(address, true);
  }

  writeByte(address: number, value: number) {
    return;
  }

  writeWord(address: number, value: number) {
    return;
  }

  get title(): string {
    const titleAreaStartOffset = 0x134;
    const titleAreaEndOffset = 0x143;
    const textDecoder = new TextDecoder();
    const titleBytes = this.gameBytes.subarray(titleAreaStartOffset, titleAreaEndOffset);
    return textDecoder.decode(titleBytes);
  }

  get typeName(): string {
    const typeOffset = 0x147;
    const typeCode = this.gameDataView.getUint8(typeOffset);
    return CartridgeType[typeCode];
  }

  get type(): CartridgeType {
    const typeOffset = 0x147;
    return this.gameDataView.getUint8(typeOffset);
  }

  get romSize() {
    const sizeOffset = 0x148;
    const sizeCode = this.gameDataView.getUint8(sizeOffset);
    const sizes = [
      0x08000,
      0x010000,
      0x020000,
      0x040000,
      0x080000,
      0x100000,
      0x200000,
      4096,
      8192,
    ];

    return sizes[sizeCode];
  }

  get ramSize() {
    const sizeOffset = 0x149;
    const sizeCode = this.gameDataView.getUint8(sizeOffset);
    const sizes = [
      0,
      0x002000,
      0x008000,
      0x032000,
      0x128000,
      0x512000,
    ];

    return sizes[sizeCode];
  }

  get versionNumber() {
    const versionNumberOffset = 0x14c;
    return this.gameDataView.getUint8(versionNumberOffset);
  }

  get hasSaveableRam() {
    return Cartridge.TypesWithBatterySave.includes(this.type);
  }
}
