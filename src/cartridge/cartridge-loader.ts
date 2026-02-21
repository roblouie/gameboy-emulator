import { CartridgeType } from "@/cartridge/cartridge-type.enum";
import { Mbc1Cartridge } from "@/cartridge/mbc1-cartridge";
import { Cartridge } from "@/cartridge/cartridge";
import { Mbc3Cartridge } from "@/cartridge/mbc3-cartridge";
import {Mbc5Cartridge} from "@/cartridge/mbc5-cartridge";

export class CartridgeLoader {
  static TypeOffset = 0x147;

  static FromArrayBuffer(gameData: ArrayBuffer): Cartridge | Mbc1Cartridge | Mbc3Cartridge {
    const gameDataView = new DataView(gameData);
    const type = gameDataView.getUint8(CartridgeLoader.TypeOffset) as CartridgeType;

    switch (type) {
      case CartridgeType.ROM:
        return new Cartridge(gameDataView);
      case CartridgeType.MBC1:
      case CartridgeType.MBC1_RAM:
      case CartridgeType.MBC1_RAM_BATTERY:
        return new Mbc1Cartridge(gameDataView);
      case CartridgeType.MBC3:
      case CartridgeType.MBC3_RAM:
      case CartridgeType.MBC3_RAM_BATTERY:
      case CartridgeType.MBC3_TIMER_BATTERY:
      case CartridgeType.MBC3_TIMER_RAM_BATTERY:
        return new Mbc3Cartridge(gameDataView);
      case CartridgeType.MBC5:
      case CartridgeType.MBC5_RAM:
      case CartridgeType.MBC5_RAM_BATTERY:
      case CartridgeType.MBC5_RUMBLE:
      case CartridgeType.MBC5_RUMBLE_RAM:
      case CartridgeType.MBC5_RUMBLE_RAM_BATTERY:
        return new Mbc5Cartridge(gameDataView);
      default:
        alert('oops not ready')
        return new Cartridge(gameDataView);
    }
  }
}