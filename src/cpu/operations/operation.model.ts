export interface Operation {
  instruction: string;
  byteDefinition: number;
  execute: () => number;
}
