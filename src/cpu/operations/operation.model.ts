export interface Operation {
  instruction: string;
  byteDefinition: number;
  cycleTime: number;
  byteLength: number;
  execute: Function;
}
