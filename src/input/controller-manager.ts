import { input } from "@/input/input";

export enum Xbox360ControllerButtons {
  A,
  B,
  X,
  Y,
  LeftBumper,
  RightBumper,
  LeftTrigger,
  RightTrigger,
  Select,
  Start,
  L3,
  R3,
  DpadUp,
  DpadDown,
  DpadLeft,
  DpadRight,
}

export class ControllerManager {
  controller = 0;
  left: number = Xbox360ControllerButtons.DpadLeft;
  right: number = Xbox360ControllerButtons.DpadRight;
  up: number = Xbox360ControllerButtons.DpadUp;
  down: number = Xbox360ControllerButtons.DpadDown;

  select = Xbox360ControllerButtons.Select;
  start = Xbox360ControllerButtons.Start;

  b = Xbox360ControllerButtons.X;
  a = Xbox360ControllerButtons.A;

  queryButtons() {
    const gamepad = navigator.getGamepads()[this.controller];

    if (!gamepad) {
      return;
    }

    input.isPressingLeft = gamepad.buttons[this.left].pressed || gamepad.axes[0] < -0.1;
    input.isPressingRight = gamepad.buttons[this.right].pressed || gamepad.axes[0] > 0.1;
    input.isPressingUp = gamepad.buttons[this.up].pressed || gamepad.axes[1] < -0.1;
    input.isPressingDown = gamepad.buttons[this.down].pressed || gamepad.axes[1] > 0.1;

    input.isPressingSelect = gamepad.buttons[this.select].pressed;
    input.isPressingStart = gamepad.buttons[this.start].pressed;

    input.isPressingB = gamepad.buttons[this.b].pressed;
    input.isPressingA = gamepad.buttons[this.a].pressed;
  }
}

export const controllerManager = new ControllerManager();
