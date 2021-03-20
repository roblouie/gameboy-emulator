import { operations } from "./instruction-set/operations";
import { cpu } from "./cpu";
import { cartridge } from "./game-rom/cartridge";

let context: CanvasRenderingContext2D;

window.addEventListener('load', () => {
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  fileInput?.addEventListener('change', onFileChange);

  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;
  console.log(operations.length);
});


async function onFileChange(event: Event) {
  const fileElement = event.target as HTMLInputElement;


  if (fileElement.files && fileElement.files[0]) {
    const arrayBuffer = await fileToArrayBuffer(fileElement.files[0]);
    cartridge.loadCartridge(arrayBuffer);

    cpu.run();

    console.log('title: ' + cartridge.title);
    console.log('version: ' + cartridge.versionNumber);
    console.log('type: ' + cartridge.type);
    console.log('rom size: ' + cartridge.romSize);
    console.log('ram size: ' + cartridge.ramSize);

    context.putImageData(cartridge.nintendoLogo, 0, 0);
  }
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException('Error parsing file'))
    }

    fileReader.readAsArrayBuffer(file);
  });
}
