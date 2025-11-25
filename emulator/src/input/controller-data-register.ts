import { SingleByteMemoryRegister } from "@/memory/memory-register";
import { memory } from "@/memory/memory";

class ControllerDataRegister implements SingleByteMemoryRegister {
  offset = 0xff00;
  name = 'P1';

  get value() {
    return memory.readByte(this.offset);
  }
}

export const controllerDataRegister = new ControllerDataRegister();
