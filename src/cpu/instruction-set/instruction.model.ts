export interface Instruction {
  command: string;
  byteDefinition: number;
  cycleTime: number;
  byteLength: number;
  operation: Function;
}
