export class CpuRegister {
  name: string;
  offset: number;
  code: number;

  protected dataView: DataView;

  constructor(name: string, offset: number, data: ArrayBuffer, code: number) {
    this.name = name;
    this.offset = offset;
    this.dataView = new DataView(data);
    this.code = code;
  }

  get value() {
      return this.dataView.getUint8(this.offset);
  }

  set value(newValue: number) {
      this.dataView.setUint8(this.offset, newValue);
  }
}

export class DoubleCpuRegister extends CpuRegister {
  override get value() {
    return this.dataView.getUint16(this.offset, true);
  }

  override set value(newValue: number) {
    this.dataView.setUint16(this.offset, newValue, true);
  }
}

export namespace CpuRegister {
  export enum PairCode {
    BC,
    DE,
    HL,
    AF,
    SP = 3,
  }
}