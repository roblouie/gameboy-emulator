import { CartridgeType } from "@/cartridge/cartridge-type.enum";
import { Mbc1Cartridge } from "@/cartridge/mbc1-cartridge";
import { Cartridge } from "@/cartridge/cartridge";

export class CartridgeLoader {
  static TypeOffset = 0x147;

  static FromArrayBuffer(gameData: ArrayBuffer): Cartridge {
    const gameDataView = new DataView(gameData);
    const type = gameDataView.getUint8(CartridgeLoader.TypeOffset) as CartridgeType;

    switch (type) {
      case CartridgeType.ROM:
        return new Cartridge(gameDataView);
      case CartridgeType.MBC1:
      case CartridgeType.MBC1_RAM:
      case CartridgeType.MBC1_RAM_BATTERY:
        return new Mbc1Cartridge(gameDataView);
      default:
        alert('oops not ready')
        return new Cartridge(gameDataView);
    }
  }
}