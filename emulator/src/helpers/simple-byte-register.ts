export class SimpleByteRegister {
  readonly offset: number;
  private byteValue: number;

  constructor(offset: number) {
    this.byteValue = 0;
    this.offset = offset;
  }

  set value(newVal: number) {
    this.byteValue = newVal & 0xff;
  }

  get value() {
    return this.byteValue;
  }
}
