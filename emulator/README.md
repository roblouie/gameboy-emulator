# TypeScript GameBoy Emulator

TypeScript GameBoy Emulator is a GameBoy emulator written from scratch in TypeScript 
with zero dependencies.

My implementation of a UI with this package can be seen here: https://roblouie.com/gameboy/

The source code for this UI is also in the `ui/` folder in the package github repo.

* [Installation](#installation)
* [Usage](#usage)
  * [Load Rom](#load-rom)
  * [Enable Audio](#enable-audio)
  * [Render to Canvas](#render-to-canvas)
  * [Run](#run)
* [API](#api)

## Installation

Install the package:

`npm install gameboy-emulator`

## Usage

First you need to create an instance of the GameBoy:

```js
import { Gameboy } from "gameboy-emulator";

const gameboy = new Gameboy();
```
After installing the package there are a couple of things you need to do to actually play games.
Primarily load a rom, enable audio, and have a canvas to render to.

There are additional steps you may want to take, for instance configuring controls,
changing colors, storing game save data, etc. Those additional features are explained
in the API section.


### Load Rom

The emulator expects the rom in ArrayBuffer form. The simplest example to implement this is to
add a file input to your html and add an event handler to convert the file to ArrayBuffer.

```html
<input type="file" class="file-input"/>
```

```js
const fileInput = menuElement.querySelector('.file-input');
fileInput.addEventListener('change', onFileChange);

async function onFileChange(event) {
  if (fileInput.files && fileInput.files[0]) {
    // Convert the selected file into an array buffer
    const rom = await fileToArrayBuffer(fileInput.files[0]);

    // load game
    gameboy.loadGame(rom);
  }
}

function fileToArrayBuffer(file) {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result);

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Error parsing file'))
    }

    fileReader.readAsArrayBuffer(file);
  });
}
```

### Enable Audio

The web does not allow auto-playing of audio, so you must enable audio support when the user
presses a button. You can add a mute button, or simply enable audio inside the event handler
for file selection. For simplicity, we will add that to our event handler from above.

```js
async function onFileChange(event) {
  if (fileInput.files && fileInput.files[0]) {
    // Convert the selected file into an array buffer
    const rom = await fileToArrayBuffer(fileInput.files[0]);

    // load game
    gameboy.loadGame(rom);
    
    // enable audio
    gameboy.apu.enableSound();
  }
}
```

### Render to Canvas

Finally you need to actually render the graphics somewhere. For flexibility the emulator just draws
the graphics to an ImageData with the native GameBoy resolution of 160x144. The emulator provied a
callback named `onFrameFinished` that will pass you the ImageData for rendering. If you want your
canvas to be larger than 160x144 (and you probably do), the simplest way is to increase the size
with css, making sure to set `image-rendering: pixelated;` to stop the browser from blurring the image.

```html
<canvas width="160" height="144"></canvas>
```

```css
canvas {
  width: 100%;
  image-rendering: pixelated;
}
```

```js
async function onFileChange(event) {
  if (fileInput.files && fileInput.files[0]) {
    const rom = await fileToArrayBuffer(fileInput.files[0]);
    gameboy.loadGame(rom);
    
    gameboy.apu.enableSound();
    
    const context = document.querySelector('canvas').getContext('2d');

    // draw the image data to canvas when a frame is drawn
    gameboy.onFrameFinished(imageData => {
      context.putImageData(imageData, 0, 0);
    });
  }
}
```

### Run

Finally, with the rom loaded and the frame callback set, run the game:
```js
async function onFileChange(event) {
  if (fileInput.files && fileInput.files[0]) {
    const rom = await fileToArrayBuffer(fileInput.files[0]);
    gameboy.loadGame(rom);
    
    gameboy.apu.enableSound();
    
    const context = document.querySelector('canvas').getContext('2d');
    gameboy.onFrameFinished(imageData => {
      context.putImageData(imageData, 0, 0);
    });
    
    // Run game
    gameboy.run();
  }
}
```

## API

* [Gameboy](#gameboy)
  * [cpu: CPU](#cpu-cpu)
    * [registers: CpuRegisterCollection](#registers-cpuregistercollection)
    * [operations: Operation[]](#operations-operation)
    * [cbSubOperations: Operation[]](#cbsuboperations-operation)
  * [gpu](#gpu)
    * [colors[]](#colors)
    * [screen: ImageData](#screen-imagedata)
  * [apu](#apu)
    * [enableSound()](#enablesound())
    * [disableSound()](#disablesound())
  * [memory](#memory)
    * [memoryBytes: Uint8Array](#memorybytes-uint8array)
    * readByte(address: number)
    * readWord(address: number)
    * writeByte(address: number, value: number)
    * writeWord(address: number, value: number)
    * reset()
  * input
    * isPressingUp: boolean
    * isPressingDown: boolean
    * isPressingLeft: boolean
    * isPressingRight: boolean
    * isPressingSelect: boolean
    * isPressingStart: boolean
    * isPressingA: boolean
    * isPressingB: boolean
  * controllerManager
    * controller: number;
    * left: number
    * right: number
    * up: number
    * down: number
    * select: number
    * start: number
    * b: number
    * a: number
  * keyboardManager
    * left: string
    * right: string
    * up: string
    * down: string
    * select: string
    * start: string
    * b: string
    * a: string 
  * onFrameFinished(callback: Function)
  * setCartridgeSaveRam(sramArrayBuffer: ArrayBuffer)
  * getCartridgeSaveRam(): ArrayBuffer
  * setOnWriteToCartridgeRam(onSramWrite: Function)

### Gameboy
Constructor to create a new Gameboy instance:
`const gameboy = new Gameboy()`

#### cpu: CPU
Contains registers and operations, executes instructions

##### registers: CpuRegisterCollection
Contains all the CPU registers. All registers can be seen here:
```js
// Getting the value of every register
gameboy.cpu.registers.A.value;
gameboy.cpu.registers.B.value;
gameboy.cpu.registers.C.value;
gameboy.cpu.registers.D.value;
gameboy.cpu.registers.E.value;
gameboy.cpu.registers.F.value;
gameboy.cpu.registers.AF.value;
gameboy.cpu.registers.BC.value;
gameboy.cpu.registers.DE.value;
gameboy.cpu.registers.HL.value;
```

##### operations: Operation[]
Collection of all base level operations (excludes cb operations, which are stored separately).

The operation type is defined as:
```ts
interface Operation {
  instruction: string;
  byteDefinition: number;
  cycleTime: number;
  byteLength: number;
  execute: Function;
}
```

So if you'd like to see the assembly for all base instructions you could do:
```js
gameboy.cpu.operations.forEach(operation => console.log(operation.instruction));
```

##### operations: Operation[]
The instruction at position `0xcb` uses the next byte to define a subset of operations.
These operations are stored here, and are the same format as operations as described above.

#### GPU
Graphics processor. Handles all drawing. Exposes screen pixel data and color palette.

##### colors[]
Defines the 4 color palette used to draw graphics:
```js
colors = [
  { red: 255, green: 255, blue: 255 },
  { red: 192, green: 192, blue: 192 },
  { red: 96, green: 96, blue: 96 },
  { red: 0, green: 0, blue: 0 },
]
```

You can change these colors to change the colors used to draw graphics. The default
is gray scale as seen above.

```js
// Use blue for color 0 instead of white
gameboy.gpu.colors[0] = { red: 0, green: 0, blue: 255 };
```

##### screen: ImageData
ImageData object containing the pixel data for the screen. This is also passed in
the `onFrameFinished` callback.

#### APU
Audio Processor. Handles playing audio, allows audio to be enabled and disabled.

##### enableSound()
Enables audio

##### disableSound()
Disables audio