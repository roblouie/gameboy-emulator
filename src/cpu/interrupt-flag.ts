export interface InterruptFlags {
  isVerticalBlanking: boolean;
  isLCDStatus: boolean;
  isTimerOverflow: boolean;
  isSerialTransferCompletion: boolean;
  isP10P13NegativeEdge: boolean;
}
