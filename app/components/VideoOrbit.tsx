'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const CARDS = [
  { src: '/images/work/ig-reel-1.mp4', poster: '/images/work/hamilton-thumb.jpg', label: 'Hamilton Watch x Call of Duty' },
  { src: '/images/work/ig-reel-2.mp4', poster: '/images/work/dodgers-thumb.jpg', label: 'LA Dodger Parade' },
  { src: '/images/work/ig-reel-3.mp4', poster: '/images/work/surfside-thumb.jpg', label: 'Illusia x Surfside' },
];

/* The fan used to be fixed at 190×274 regardless of how large its container
   was, which left it marooned in dead space. Everything is now derived from a
   measured card width so the fan fills whatever box it is given.

   Cards are 9:16 to match the source reels — they read considerably larger in
   the same frame and the video is cropped less than the old 1:1.44. */
const CARD_RATIO = 16 / 9;      // height as a multiple of width
const OVERLAP_RATIO = 0.25;     // how far each card tucks under its neighbour
const HEADROOM_RATIO = 0.17;    // clearance above AND below the row: the top
                                // absorbs the hover lift, the bottom keeps the
                                // cards off the frame edge so they sit centred
const RAISE_RATIO = 0.11;       // hover lift
const FILL = 0.94;              // fraction of the container the fan occupies
const MIN_W = 96;
const MAX_W = 300;              // stops the cards ballooning on very wide layouts

/* Measure before paint on the client so the fan never flashes at the wrong
   size; useLayoutEffect would warn during SSR. */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function VideoFan() {
  const [hovered, setHovered] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(220);

  useIsoLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Total fan width expressed in card widths: the first card, plus the
    // exposed portion of each one after it.
    const span = 1 + (CARDS.length - 1) * (1 - OVERLAP_RATIO);

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const byWidth = (width * FILL) / span;
      const byHeight = height / (CARD_RATIO + HEADROOM_RATIO * 2);
      setCardW(Math.max(MIN_W, Math.min(MAX_W, Math.min(byWidth, byHeight))));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Touch devices never fire hover, so the fan sat frozen on its posters.
     Start the reels on mount instead — muted + playsInline is what lets iOS
     play them inline. Low Power Mode still refuses, which is why every card
     carries a real poster frame rather than falling back to a black box. */
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;
    videoRefs.current.forEach(v => v?.play().catch(() => { /* poster stays */ }));
  }, []);

  const CARD_H = cardW * CARD_RATIO;
  const OVERLAP = cardW * OVERLAP_RATIO;
  const HEADROOM = cardW * HEADROOM_RATIO;
  const RAISE = cardW * RAISE_RATIO;
  const RADIUS = Math.round(cardW * 0.095);
  const CARD_W = cardW;

  const enter = (i: number) => {
    setHovered(i);
    videoRefs.current[i]?.play().catch(() => { /* autoplay policy — poster stays */ });
  };
  const leave = (i: number) => {
    setHovered(h => (h === i ? null : h));
    videoRefs.current[i]?.pause();
  };

  const step = CARD_W - OVERLAP;
  const totalW = CARD_W + step * (CARDS.length - 1);

  return (
    <div ref={wrapRef} style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: '16px',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="fan-stage" style={{ position: 'relative', width: `${Math.round(totalW)}px`, height: `${Math.round(CARD_H + HEADROOM * 2)}px` }}>
        {CARDS.map((card, i) => {
          const isHovered = hovered === i;
          return (
            <div
              key={i}
              onMouseEnter={() => enter(i)}
              onMouseLeave={() => leave(i)}
              style={{
                position: 'absolute',
                left: `${Math.round(i * step)}px`,
                top: `${Math.round(HEADROOM)}px`,
                width: `${Math.round(CARD_W)}px`,
                height: `${Math.round(CARD_H)}px`,
                borderRadius: `${RADIUS}px`,
                overflow: 'hidden',
                background: '#1a1a1a',
                transform: isHovered ? `translateY(-${Math.round(RAISE)}px) scale(1.05)` : 'none',
                transition: 'transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease',
                boxShadow: isHovered ? '0 32px 80px rgba(0,0,0,0.75)' : '0 18px 48px rgba(0,0,0,0.55)',
                zIndex: isHovered ? 10 : i === 1 ? 2 : 1, // middle card rides on top of the bunch
                cursor: 'pointer',
              }}
            >
              <video
                ref={el => { videoRefs.current[i] = el; }}
                src={card.src}
                poster={card.poster || undefined}
                muted
                loop
                playsInline
                preload="auto"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Project label — subtle, over a faint gradient for legibility.
                  Side-card labels hug their card's un-overlapped zone so the
                  middle card never covers them at rest. */}
              <div style={{
                position: 'absolute',
                left: 0, right: 0, bottom: 0,
                padding: '30px 14px 12px',
                paddingRight: i === 0 ? `${Math.round(OVERLAP) + 12}px` : '14px',
                paddingLeft: i === CARDS.length - 1 ? `${Math.round(OVERLAP) + 12}px` : '14px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
                pointerEvents: 'none',
              }}>
                <span style={{
                  display: 'block',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1.5,
                  color: '#fff',
                  opacity: 0.75,
                  textAlign: i === 0 ? 'left' : i === CARDS.length - 1 ? 'right' : 'center',
                }}>
                  {card.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* No scale() media queries — the fan measures its container, so it
          already fits on small screens without being shrunk twice. */}
    </div>
  );
}
