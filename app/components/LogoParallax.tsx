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
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // On portrait the logo would otherwise sit small inside a contained 16:9
    // frame; nudge it up so it reads at the intended size.
    const PORTRAIT_FILL = 1.2;

    // Cover-fit on landscape screens; contain-fit (boosted) on portrait ones.
    // The frames are 16:9 — plain cover on a tall phone crops to ~30% of the
    // image and beheads the logo; the background is black so the letterbox is
    // invisible.
    const drawFrame = (img: HTMLImageElement) => {
      const cw = canvas.width, ch = canvas.height;
      const portrait = ch > cw;
      const scale = portrait
        ? Math.min(cw / FRAME_W, ch / FRAME_H) * PORTRAIT_FILL
        : Math.max(cw / FRAME_W, ch / FRAME_H);
      const sw = FRAME_W * scale, sh = FRAME_H * scale;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    };

    const setSize = () => {
      // Size the backing store to the device pixel ratio so the logo is sharp
      // on retina/phone screens instead of a scaled-up low-res blur. Cap the
      // ratio so the canvas never balloons past what the 1280px frames warrant.
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
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
      // Start while the section is still rising into view so the logo is
      // already spinning as it appears — no static black lead-in.
      start: 'top 80%',
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
