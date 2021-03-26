interface MemoryRegister {
  offset: number;
  name: string;
}

export interface SingleByteMemoryRegister extends MemoryRegister {
  value: number;
}

export interface MultiByteMemoryRegister extends MemoryRegister{
  getValueAt(index: Number): number;
}
