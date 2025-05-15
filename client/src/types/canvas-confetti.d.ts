declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  interface ConfettiCannon {
    fire: (options?: ConfettiOptions) => void;
    reset: () => void;
  }

  type ConfettiFn = (options?: ConfettiOptions) => Promise<any>;
  
  interface ConfettiGenerator extends ConfettiFn {
    reset: () => void;
    create: (canvas: HTMLCanvasElement, options?: { resize?: boolean }) => ConfettiCannon;
  }
  
  const confetti: ConfettiGenerator;
  
  export default confetti;
}