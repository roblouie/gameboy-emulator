import { input } from "@/input/input";

enum Xbox360ControllerButtons {
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

class ControllerManager {
  constructor() {
    // window.addEventListener('gamepadconnected', ({ gamepad }) => this.setController(gamepad));
  }

  queryButtons() {
    const gamepad = navigator.getGamepads()[0];

    if (!gamepad) {
      return;
    }

    input.isPressingLeft = gamepad.buttons[Xbox360ControllerButtons.DpadLeft].value === 1;
    input.isPressingRight = gamepad.buttons[Xbox360ControllerButtons.DpadRight].pressed;
    input.isPressingUp = gamepad.buttons[Xbox360ControllerButtons.DpadUp].pressed;
    input.isPressingDown = gamepad.buttons[Xbox360ControllerButtons.DpadDown].pressed;

    input.isPressingSelect = gamepad.buttons[Xbox360ControllerButtons.Select].pressed;
    input.isPressingStart = gamepad.buttons[Xbox360ControllerButtons.Start].pressed;

    input.isPressingB = gamepad.buttons[Xbox360ControllerButtons.X].pressed;
    input.isPressingA = gamepad.buttons[Xbox360ControllerButtons.A].pressed;
  }
}

export const controllerManager = new ControllerManager();