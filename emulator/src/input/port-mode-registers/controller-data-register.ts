import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

class ControllerDataRegister implements SingleByteMemoryRegister {
  offset = 0xff00;
  name = 'P1';

  get value() {
    return memory.readByte(this.offset);
  }

  get isPollingDirections() {
    return (memory.readByte(this.offset) >> 4) & 0b1;
  }

  get isPollingButtons() {
    return (memory.readByte(this.offset) >> 5) & 0b1;
  }
}

export const controllerDataRegister = new ControllerDataRegister();
