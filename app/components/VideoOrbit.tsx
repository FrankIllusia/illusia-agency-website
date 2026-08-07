'use client';

import { useRef, useState } from 'react';

const CARDS = [
  { src: '/images/work/ig-reel-1.mp4', poster: '/images/work/ig-thumb-1.png', label: 'Hamilton Watch x Call of Duty' },
  { src: '/images/work/ig-reel-2.mp4', poster: '', label: 'LA Dodger Parade' },
  { src: '/images/work/ig-reel-3.mp4', poster: '', label: 'Illusia x Surfside' },
];

const CARD_W = 190;
const CARD_H = 274;
const OVERLAP = 48;   // how far each card tucks under its neighbor
const RAISE = 26;     // hover lift
const HEADROOM = 34;  // space above the row so a raised card never clips

export default function VideoFan() {
  const [hovered, setHovered] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: '16px',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="fan-stage" style={{ position: 'relative', width: `${totalW}px`, height: `${CARD_H + HEADROOM}px` }}>
        {CARDS.map((card, i) => {
          const isHovered = hovered === i;
          return (
            <div
              key={i}
              onMouseEnter={() => enter(i)}
              onMouseLeave={() => leave(i)}
              style={{
                position: 'absolute',
                left: `${i * step}px`,
                top: `${HEADROOM}px`,
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                borderRadius: '18px',
                overflow: 'hidden',
                background: '#1a1a1a',
                transform: isHovered ? `translateY(-${RAISE}px) scale(1.05)` : 'none',
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
                paddingRight: i === 0 ? `${OVERLAP + 12}px` : '14px',
                paddingLeft: i === CARDS.length - 1 ? `${OVERLAP + 12}px` : '14px',
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

      {/* Fixed-px layout (~480px wide) — scale the whole fan down on small screens */}
      <style>{`
        @media (max-width: 700px) {
          .fan-stage { transform: scale(0.8); }
        }
        @media (max-width: 480px) {
          .fan-stage { transform: scale(0.55); }
        }
      `}</style>
    </div>
  );
}
