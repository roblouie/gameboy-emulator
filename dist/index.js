import { operations } from "@/cpu/instruction-set/operations";
import { cartridge, CartridgeEntryPointOffset } from "@/game-rom/cartridge";
import { registers } from "@/cpu/registers/registers";
import { backgroundTilesToImageData, characterImageData } from "@/gpu/gpu-debug-helpers";
import { Gameboy } from "@/gameboy";
let context;
let vramCanvas;
let vramContext;
let backgroundCanvas;
let backgroundContext;
window.addEventListener('load', () => {
    const fileInput = document.querySelector('.file-input');
    fileInput?.addEventListener('change', onFileChange);
    const canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    vramCanvas = document.querySelector('#vram');
    vramContext = vramCanvas.getContext('2d');
    backgroundCanvas = document.querySelector('#background');
    backgroundContext = backgroundCanvas.getContext('2d');
    console.log(operations.length);
});
async function onFileChange(event) {
    const fileElement = event.target;
    if (fileElement.files && fileElement.files[0]) {
        const arrayBuffer = await fileToArrayBuffer(fileElement.files[0]);
        cartridge.loadCartridge(arrayBuffer);
        console.log('title: ' + cartridge.title);
        console.log('version: ' + cartridge.versionNumber);
        console.log('type: ' + cartridge.type);
        console.log('rom size: ' + cartridge.romSize);
        console.log('ram size: ' + cartridge.ramSize);
        // context.putImageData(cartridge.nintendoLogo, 0, 0);
        let cycles = 0;
        registers.programCounter = CartridgeEntryPointOffset;
        // Temporarily just running until TestGame.GB properly sets the lcd control registers
        // This happens right before the main game loop, and can be seen on line 188 of testGame.asm
        // while (gpuRegisters.lcdControl.backgroundCharacterData !== 1) {
        // // while(cycles <= CyclesPerFrame) {
        //   cycles += cpu.tick();
        //   gpu.tick(cycles);
        // }
        //
        //
        // context.putImageData(gpu.screen, 0, 0);
        //
        // console.log(cycles);
        const gameboy = new Gameboy();
        const fpsDiv = document.querySelector('#fps');
        gameboy.onFrameFinished((imageData, fps) => {
            context.putImageData(imageData, 0, 0);
            if (fpsDiv) {
                fpsDiv.innerHTML = `FPS: ${fps}`;
            }
        });
        gameboy.run();
        vramContext.imageSmoothingEnabled = false;
        vramContext.putImageData(characterImageData(), 0, 0);
        vramContext.drawImage(vramCanvas, 0, 0, 8 * vramCanvas.width, 8 * vramCanvas.height);
        backgroundContext.imageSmoothingEnabled = false;
        backgroundContext.putImageData(backgroundTilesToImageData(), 0, 0);
        backgroundContext.drawImage(backgroundCanvas, 0, 0, 2 * backgroundCanvas.width, 2 * backgroundCanvas.height);
    }
}
function fileToArrayBuffer(file) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = () => {
            fileReader.abort();
            reject(new DOMException('Error parsing file'));
        };
        fileReader.readAsArrayBuffer(file);
    });
}
//# sourceMappingURL=index.js.map