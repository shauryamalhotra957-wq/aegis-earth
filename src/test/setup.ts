import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window, "requestAnimationFrame", {
  writable: true,
  value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(Date.now()), 16)
});

Object.defineProperty(window, "cancelAnimationFrame", {
  writable: true,
  value: (id: number) => window.clearTimeout(id)
});

const mockCanvasContext = vi.fn(() => {
  const noop = vi.fn();
  return {
    addColorStop: noop,
    arc: noop,
    beginPath: noop,
    clearRect: noop,
    closePath: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    fill: noop,
    fillRect: noop,
    lineTo: noop,
    moveTo: noop,
    setTransform: noop,
    stroke: noop,
    get fillStyle() {
      return "";
    },
    set fillStyle(_value: string) {
      noop();
    },
    get strokeStyle() {
      return "";
    },
    set strokeStyle(_value: string) {
      noop();
    },
    get lineWidth() {
      return 1;
    },
    set lineWidth(_value: number) {
      noop();
    }
  } as unknown as CanvasRenderingContext2D;
});

HTMLCanvasElement.prototype.getContext =
  mockCanvasContext as unknown as typeof HTMLCanvasElement.prototype.getContext;
