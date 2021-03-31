export class CpuRegister {
  name: string;
  offset: number;
  code: number;

  protected dataView: DataView;
  protected readonly byteSize: 1 | 2;

  constructor(name: string, offset: number, data: ArrayBuffer, code: CpuRegister.Code | CpuRegister.PairCode, byteSize: 1 | 2 = 1) {
    this.name = name;
    this.offset = offset;
    this.dataView = new DataView(data);
    this.code = code;
    this.byteSize = byteSize;
  }

  get value() {
    if (this.byteSize === 1) {
      return this.dataView.getUint8(this.offset);
    } else {
      return this.dataView.getUint16(this.offset, true);
    }
  }

  set value(newValue: number) {
    if (this.byteSize === 1) {
      this.dataView.setUint8(this.offset, newValue);
    } else {
      this.dataView.setUint16(this.offset, newValue, true);
    }
  }
}

export namespace CpuRegister {
  export enum Code {
    A = 0b111,
    B = 0b000,
    C = 0b001,
    D = 0b010,
    E = 0b011,
    H = 0b100,
    L = 0b101,
  }

  export enum PairCode {
    BC,
    DE,
    HL,
    AF,
    SP = 3,
  }
}