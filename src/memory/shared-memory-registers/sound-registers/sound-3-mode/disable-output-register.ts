import { setBit } from "@/helpers/binary-helpers";
import { memory } from "@/memory/memory";
import { SingleByteMemoryRegister } from "../../memory-register";


export class DisableOutputRegister implements SingleByteMemoryRegister {
  offset = 0xff1b;
  name = 'NR30';

  get value() {
    return memory.readByte(this.offset);
  }
  
  get isOutputEnabled() {
    return this.value >> 7 === 1;
  }

  set isOutputEnabled(value: boolean) {
    const newValue = setBit(this.value, 7, value ? 1 : 0);
    memory.writeByte(this.offset, newValue);
  }
}