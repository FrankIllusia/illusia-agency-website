'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CARDS = [
  { src: '/images/work/ig-reel-1.mp4', poster: '/images/work/ig-thumb-1.png' },
  { src: '/images/work/ig-reel-2.mp4', poster: '' },
  { src: '/images/work/ig-reel-3.mp4', poster: '' },
];

const CARD_W = 188;
const CARD_H = 270;
const RADIUS = 210;
const TILT_X = -10;
const SPEED  = 16;
const LOGO_W = 58;
const LOGO_H = Math.round(LOGO_W * (738 / 822));

export default function VideoOrbit() {
  const spinRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orbit = gsap.to(spinRef.current, {
      rotationY: 360,
      duration: SPEED,
      ease: 'none',
      repeat: -1,
    });

    // Logo rotates on Y-axis in the same direction, same speed
    const logoSpin = gsap.to(logoRef.current, {
      rotationY: 360,
      duration: SPEED,
      ease: 'none',
      repeat: -1,
    });

    return () => { orbit.kill(); logoSpin.kill(); };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '700px',
      background: '#000',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/*
        Single preserve-3d context — tilt wrapper is also the positioning
        container for the logo so the browser depth-sorts cards vs logo
        automatically based on their actual Z position.
      */}
      <div style={{
        position: 'relative',
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${TILT_X}deg)`,
      }}>
        {/* Spinning card ring */}
        <div
          ref={spinRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '18px',
                overflow: 'hidden',
                background: '#1a1a1a',
                transform: `rotateY(${i * (360 / CARDS.length)}deg) translateZ(${RADIUS}px)`,
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
            >
              <video
                src={card.src}
                poster={card.poster || undefined}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>

        {/*
          Logo at z=0 — sits at the center of the orbit.
          Cards at the front of the orbit (translateZ +210 toward viewer) render
          in front of it; cards at the back render behind it. No z-index needed —
          the 3D context handles depth automatically.
        */}
        <div
          ref={logoRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${LOGO_W}px`,
            height: `${LOGO_H}px`,
            marginTop: `-${LOGO_H / 2}px`,
            marginLeft: `-${LOGO_W / 2}px`,
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
        >
          {['illusia-icon-body', 'illusia-icon-dot-left', 'illusia-icon-dot-right'].map(name => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={name}
              src={`/images/${name}.png`}
              alt=""
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
