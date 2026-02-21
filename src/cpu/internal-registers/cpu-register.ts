export class CpuRegister {
  readonly name: string;
  readonly code: number;

  protected readonly offset: number;
  protected readonly dataView: DataView;

  constructor(name: string, offset: number, dataView: DataView, code: number) {
    this.name = name;
    this.offset = offset;
    this.dataView = dataView;
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
