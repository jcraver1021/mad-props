declare module "gif.js" {
  export interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    transparent?: string | null;
  }

  export interface FrameOptions {
    delay?: number;
    copy?: boolean;
    dispose?: number;
  }

  export default class GIF {
    constructor(options: GIFOptions);
    addFrame(
      image: ImageData | HTMLCanvasElement | CanvasRenderingContext2D,
      options?: FrameOptions,
    ): void;
    on(event: "finished", callback: (blob: Blob) => void): void;
    on(event: "progress", callback: (progress: number) => void): void;
    on(event: "abort", callback: () => void): void;
    render(): void;
    abort(): void;
  }
}
