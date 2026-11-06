"use client";

import { useEffect, useRef } from "react";

type SteamBackgroundProps = { active?: boolean; className?: string };

// A small, seamless cloud texture is painted once, then gently drifted in layers.
// The animation never updates React state and only runs while it is visible.
export default function SteamBackground({ active = true, className = "" }: SteamBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const texture = document.createElement("canvas");
    texture.width = texture.height = 256;
    const textureContext = texture.getContext("2d");
    if (!textureContext) return;
    const pixels = textureContext.createImageData(256, 256);
    const smooth = (value: number) => value * value * (3 - 2 * value);
    const hash = (x: number, y: number) => {
      const value = Math.sin(x * 127.1 + y * 311.7 + 19.3) * 43758.5453;
      return value - Math.floor(value);
    };
    const noise = (x: number, y: number, period: number) => {
      const ix = Math.floor(x), iy = Math.floor(y);
      const fx = smooth(x - ix), fy = smooth(y - iy);
      const a = hash(ix % period, iy % period);
      const b = hash((ix + 1) % period, iy % period);
      const c = hash(ix % period, (iy + 1) % period);
      const d = hash((ix + 1) % period, (iy + 1) % period);
      return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
    };
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        let value = 0;
        for (let octave = 0; octave < 5; octave++) {
          const frequency = 4 * 2 ** octave;
          value += noise(x / 256 * frequency, y / 256 * frequency, frequency) * 0.5 ** (octave + 1);
        }
        const index = (y * 256 + x) * 4;
        pixels.data[index] = 235;
        pixels.data[index + 1] = 227;
        pixels.data[index + 2] = 210;
        pixels.data[index + 3] = Math.round(Math.max(0, value - 0.26) ** 1.6 * 330);
      }
    }
    textureContext.putImageData(pixels, 0, 0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, previous = 0, elapsed = 0, visible = false;
    let width = 1, height = 1;
    const paint = () => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";
      for (let layer = 0; layer < 3; layer++) {
        const size = Math.max(width * 0.85, height * 1.1) * (1 + layer * 0.32);
        const x = ((elapsed * (layer === 1 ? -6 : 9) + layer * 173) % size + size) % size;
        const y = ((-elapsed * (5 + layer * 2) + layer * 227) % size + size) % size;
        context.globalAlpha = layer === 0 ? 0.85 : 0.5;
        for (let row = -1; row * size + y < height; row++) {
          for (let col = -1; col * size + x < width; col++) {
            context.drawImage(texture, col * size + x, row * size + y, size, size);
          }
        }
      }
    };
    const tick = (now: number) => {
      if (now - previous >= 1000 / 30) {
        elapsed += Math.min((now - previous) / 1000, 0.05);
        previous = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (active && visible && !document.hidden && !reducedMotion.matches) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      } else paint();
    };
    const resize = new ResizeObserver(([entry]) => {
      width = Math.max(1, Math.round(entry.contentRect.width));
      height = Math.max(1, Math.round(entry.contentRect.height));
      // Cap the backing resolution; soft steam needs no high-DPI rendering.
      const scale = Math.min(1, 1200 / width);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      paint();
    });
    resize.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, [active]);

  return <div className={`steam-background ${active ? "" : "steam-background-off"} ${className}`} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
