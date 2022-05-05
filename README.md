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
* [Default Controls](#default-controls)
* [API](#api)

The simple example shown below has been implemented in a folder in the github repo named simple-example.

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
const fileInput = document.querySelector('.file-input');
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
// enable audio
gameboy.apu.enableSound();
```

#### Note: https and same origin required for audio to work due to SharedArrayBuffer
In order to provide near real-time buffered audio, this emulator uses a shared array buffer to
write to an audio player on another thread. Since this allows direct memory access, certain security
features are required. First, you must use https. In addition, you must have the following headers set
on your server:

```
'Cross-Origin-Opener-Policy': 'same-origin'
'Cross-Origin-Embedder-Policy': 'require-corp'
```

You can see these being set in the webpack dev server in the simple example projects. You can still
use the emulator without this, but audio will not work.

### Render to Canvas

Finally you need to actually render the graphics somewhere. For flexibility the emulator just draws
the graphics to an ImageData with the native GameBoy resolution of 160x144. The emulator provides a
callback named `onFrameFinished` that will pass you the ImageData for rendering. If you want your
canvas to be larger than 160x144 (and you probably do), the simplest way is to increase the size
with css, making sure to set `image-rendering: pixelated;` to stop the browser from blurring the image.

This can be set up at any time, but for convenience we will set this callback in the same event handler:
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
const context = document.querySelector('canvas').getContext('2d');

// draw the image data to canvas when a frame is drawn
gameboy.onFrameFinished(imageData => {
  context.putImageData(imageData, 0, 0);
});
```

### Run

Finally, with the rom loaded and the frame callback set, run the game with `gameboy.run()`

Our full JavaScript that does everything we need looks like this:
```js
import { Gameboy } from "gameboy-emulator";
const gameboy = new Gameboy();

const fileInput = document.querySelector('.file-input');
fileInput.addEventListener('change', onFileChange);

async function onFileChange(event) {
  if (fileInput.files && fileInput.files[0]) {
    const rom = await fileToArrayBuffer(fileInput.files[0]);
    gameboy.loadGame(rom);

    gameboy.apu.enableSound();

    const context = document.querySelector('canvas').getContext('2d');
    gameboy.onFrameFinished(imageData => {
      context.putImageData(imageData, 0, 0);
    });

    gameboy.run(); // Run the game
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

## Default Controls
The emulator comes with built-in controller and keyboard support. It defaults to
the first active controller found. Default key bindings are:

### Controller
* Left: Dpad left and first analog stick left
* Right: Dpad right and first analog stick right
* Up: Dpad up and first analog stick up
* Down: Dpad down and first analog stick down
* A: Button 2, which is the X button on an XBox controller
* B: Button 0, which is the A button on an XBox controller
* Select: Button 8, which is the select button on an Xbox controller
* Start: Button 9, which is the start button on an Xbox controller

### Keyboard
* Left: Left Arrow
* Right: Right Arrow
* Up: Up Arrow
* Down: Down Arrow
* A: A key
* B: B key
* Select: Right Control
* Start: Enter

## API

* [Gameboy](#gameboy)
    * [cpu: CPU](#cpu-cpu)
        * [registers: CpuRegisterCollection](#registers-cpuregistercollection)
        * [operationMap: Map<number, Operation>](#operations-operation)
        * [cbSubOperationMap: Map<number, Operation>](#cbsuboperations-operation)
    * [gpu](#gpu)
        * [colors[]](#colors)
        * [screen: ImageData](#screen-imagedata)
    * [apu](#apu)
        * [enableSound()](#enablesound)
        * [disableSound()](#disablesound)
    * [cartridge](#cartridge)
        * title
        * typeName
        * romSize
        * ramSize
        * versionNumber
    * [memory](#memory)
        * [memoryBytes: Uint8Array](#memorybytes-uint8array)
        * [readByte(address: number)](#readbyteaddress-number)
        * [readWord(address: number)](#readwordaddress-number)
        * [writeByte(address: number, value: number)](#writebyteaddress-number)
        * [writeWord(address: number, value: number)](#writewordaddress-number)
        * [reset()](#reset)
    * [input](#input)
        * isPressingUp: boolean
        * isPressingDown: boolean
        * isPressingLeft: boolean
        * isPressingRight: boolean
        * isPressingSelect: boolean
        * isPressingStart: boolean
        * isPressingA: boolean
        * isPressingB: boolean
    * [controllerManager](#controllermanager)
        * controller: number
        * left: number
        * right: number
        * up: number
        * down: number
        * select: number
        * start: number
        * b: number
        * a: number
    * [keyboardManager](#keyboardmanager)
        * left: string
        * right: string
        * up: string
        * down: string
        * select: string
        * start: string
        * b: string
        * a: string
    * [loadGame(romData: ArrayBuffer)](#loadgameromdata-arraybuffer)
    * [run()](#run)
    * [onFrameFinished(callback: Function)](#onframefinishedcallback-function)
    * [setOnWriteToCartridgeRam(onSramWrite: Function)](#setonwritetocartridgeramonsramwrite-function)
    * [getCartridgeSaveRam(): ArrayBuffer](#getcartridgesaveram-arraybuffer)
    * [setCartridgeSaveRam(sramArrayBuffer: ArrayBuffer)](#setcartridgesaveramsramarraybuffer-arraybuffer)

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
gameboy.cpu.registers.stackPointer.value;
gameboy.cpu.registers.programCounter.value;
```

##### operationMap: Map<number, Operation>
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
for (const operation of gameboy.cpu.operationMap.values()) {
  console.log(operation.instruction);
}
```

##### cbSubOperationMap: Map<number, Operation>
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

#### cartridge
The inserted cartridge. Information about the cartridge can be queried
* title
* typeName
* romSize
* ramSize
* versionNumber

```js
// For Link's Adventure:

console.log(gameboy.cartridge.title)    // prints ZELDA
console.log(gameboy.cartridge.version)  // prints 0
console.log(gameboy.cartridge.typeName) // prints MBC1_RAM_BATTERY
console.log(gameboy.cartridge.romSize)  // prints 524288
console.log(gameboy.cartridge.ramSize)  // prints 32768
```

#### memory
System memory, including attached items like the cartridge

##### memoryBytes: Uint8Array
`Uint8Array` containing all of the systems memory

##### readByte(address: number)
Read the byte at a given address

##### readWord(address: number)
Read a word at the given address

##### writeByte(address: number, value: number)
Writes a byte value to the address specified

##### writeWord(address: number, value: number)
Writes a word value to the address specified

##### reset()
Resets all memory back to default value

#### input
This is the internal input state used by the GameBoy itself. The controller and keyboard
in turn set these booleans to true or false.

These can be used to programmatically set the input state. Useful for creating touch controls or any
sort of programmatic input.

* isPressingUp: boolean
* isPressingDown: boolean
* isPressingLeft: boolean
* isPressingRight: boolean
* isPressingSelect: boolean
* isPressingStart: boolean
* isPressingA: boolean
* isPressingB: boolean

#### controllerManager
Used for managing controller input. Stores a number for the index of the controller to use, and
then stores numbers representing the number of each button on the controller.

You can change these values to change which controller to use (if multiple are active) and what
buttons to use.

* controller: number
* left: number
* right: number
* up: number
* down: number
* select: number
* start: number
* b: number
* a: number

#### keyboardManager
Used for managing keyboard input. Stores the key code for the key to use.

So for instance the default value for left is 'ArrowLeft'

```js
console.log(gameboy.keyboardManager.left) // Prints ArrowLeft
```

* left: string
* right: string
* up: string
* down: string
* select: string
* start: string
* b: string
* a: string

#### loadGame(romData: ArrayBuffer)

Loads a game cartridge into memory. Similar to inserting a cartridge into a GameBoy

#### run()

Starts emulation. Similar to turning on the power switch of the GameBoy.

#### onFrameFinished(callback: Function)
Set a callback that runs every time a frame is drawn. Passes an `ImageData` object to the callback
that contains the current frame.

#### setOnWriteToCartridgeRam(onSramWrite: Function)
Set a callback that runs every time a cartridge's SRAM is written to.

NOTE! This is not passed any argument. You must retrieve the actual sram data by calling
`getCartridgeSaveRam()`

#### getCartridgeSaveRam()
Returns an `ArrayBuffer` with the contents of the cartridge's SRAM.

Combining this with `setOnWriteToCartridgeRam` will allow you to persist save data when
a player saves. Here's an example using localforage:

```js
// Will save a games save data with the key of it's title
gameboy.setOnWriteToCartridgeRam(() => {
  localforage.setItem(gameboy.cartridge.title, gameboy.getCartridgeSaveRam())
})
```

#### setCartridgeSaveRam(sramArrayBuffer: ArrayBuffer)
Set the sram in a cartridge. This will let you load saved data. Here's an example with localforage that
should be called after the rom data is loaded

```js
gameboy.loadGame(rom);
const sram = await localforage.getItem(gameboy.cartridge.title);
gameboy.setCartridgeSaveRam(sram);
gameboy.run();
```
