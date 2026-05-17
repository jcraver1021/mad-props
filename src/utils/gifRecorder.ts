import html2canvas from "html2canvas";
import GIF from "gif.js";

export async function recordAnimationAsGif(
  element: HTMLElement,
  duration: number,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const frames: ImageData[] = [];
    const frameDelay = 100; // Capture every 100ms
    const totalFrames = Math.ceil(duration / frameDelay);
    let currentFrame = 0;

    const captureFrame = async () => {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: "#1a0f08",
          scale: 0.5, // Reduce size for smaller GIF
          logging: false,
        });

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          frames.push(imageData);
        }

        currentFrame++;

        if (currentFrame < totalFrames) {
          setTimeout(captureFrame, frameDelay);
        } else {
          // All frames captured, now encode as GIF
          encodeGif(frames, frameDelay, resolve, reject, onProgress);
        }
      } catch (error) {
        reject(error);
      }
    };

    captureFrame();
  });
}

function encodeGif(
  frames: ImageData[],
  delay: number,
  resolve: (blob: Blob) => void,
  reject: (error: Error) => void,
  onProgress?: (progress: number) => void,
) {
  if (frames.length === 0) {
    reject(new Error("No frames captured"));
    return;
  }

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: frames[0].width,
    height: frames[0].height,
    workerScript: "/gif.worker.js",
  });

  gif.on("progress", (p: number) => {
    if (onProgress) {
      onProgress(p);
    }
  });

  gif.on("finished", (blob: Blob) => {
    resolve(blob);
  });

  frames.forEach((frame) => {
    gif.addFrame(frame, { delay });
  });

  gif.render();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
