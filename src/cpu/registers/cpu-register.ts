export class CpuRegister {
  name: string;
  offset: number;
  code: number;

  private dataView: DataView;
  private readonly byteSize: 1 | 2;

  constructor(name: string, offset: number, data: ArrayBuffer, code: number, byteSize: 1 | 2 = 1) {
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
