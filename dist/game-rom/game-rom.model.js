var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _gameDataView, _gameBytes;
export class GameRom {
    constructor(gameData) {
        _gameDataView.set(this, void 0);
        _gameBytes.set(this, void 0);
        __classPrivateFieldSet(this, _gameDataView, new DataView(gameData));
        __classPrivateFieldSet(this, _gameBytes, new Uint8Array(gameData));
    }
    get title() {
        const titleAreaStartOffset = 0x134;
        const titleAreaEndOffset = 0x143;
        const textDecoder = new TextDecoder();
        const titleBytes = __classPrivateFieldGet(this, _gameBytes).subarray(titleAreaStartOffset, titleAreaEndOffset);
        return textDecoder.decode(titleBytes);
    }
    get type() {
        const typeOffset = 0x147;
        const typeCode = __classPrivateFieldGet(this, _gameDataView).getUint8(typeOffset);
        const cartridgeTypes = [
            'ROM',
            'ROM + MBC1',
            'ROM + MBC1 + RAM',
            'ROM + MBC1 + RAM + BATTERY',
            'ROM + MBC2',
            'ROM + MBC2 + BATTERY',
        ];
        return cartridgeTypes[typeCode];
    }
    get romSize() {
        const sizeOffset = 0x148;
        const sizeCode = __classPrivateFieldGet(this, _gameDataView).getUint8(sizeOffset);
        const sizes = [
            256,
            512,
            1024,
            2048,
            4096,
        ];
        return sizes[sizeCode];
    }
    get ramSize() {
        const sizeOffset = 0x149;
        const sizeCode = __classPrivateFieldGet(this, _gameDataView).getUint8(sizeOffset);
        const sizes = [
            0,
            16,
            64,
            256,
        ];
        return sizes[sizeCode];
    }
    get versionNumber() {
        const versionNumberOffset = 0x14c;
        return __classPrivateFieldGet(this, _gameDataView).getUint8(versionNumberOffset);
    }
}
_gameDataView = new WeakMap(), _gameBytes = new WeakMap();
GameRom.InstructionStartOffset = 0x100;
//# sourceMappingURL=game-rom.model.js.map