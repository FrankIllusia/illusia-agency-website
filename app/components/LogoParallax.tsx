'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 358;
const FRAME_W = 1280;
const FRAME_H = 720;

export default function LogoParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cover-fit on landscape screens; contain-fit on portrait ones.
    // The frames are 16:9 — cover on a tall phone screen crops to ~30% of the
    // image and beheads the logo, and the background is black anyway so the
    // letterbox is invisible.
    const drawFrame = (img: HTMLImageElement) => {
      const cw = canvas.width, ch = canvas.height;
      const portrait = ch > cw;
      const scale = portrait
        ? Math.min(cw / FRAME_W, ch / FRAME_H)
        : Math.max(cw / FRAME_W, ch / FRAME_H);
      const sw = FRAME_W * scale, sh = FRAME_H * scale;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    };

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Resizing clears the canvas — repaint the current frame so rotating a
      // phone (or resizing the window) doesn't leave it blank until scroll.
      const frame = framesRef.current[Math.max(currentFrameRef.current, 0)];
      if (frame) drawFrame(frame);
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Preload all frames; draw frame 0 immediately when ready
    framesRef.current = new Array(FRAME_COUNT).fill(null);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/images/blade-frames/${String(i).padStart(4, '0')}.jpg`;
      img.onload = () => {
        framesRef.current[i] = img;
        if (i === 0) drawFrame(img);
      };
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(Math.round(self.progress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
        if (idx === currentFrameRef.current) return;
        currentFrameRef.current = idx;
        const frame = framesRef.current[idx];
        if (frame) drawFrame(frame);
      },
    });

    return () => {
      window.removeEventListener('resize', setSize);
      st.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: '175vh', position: 'relative', background: '#000' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #000 0%, transparent 40%, transparent 60%, #000 100%)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}
