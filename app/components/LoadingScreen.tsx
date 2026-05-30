'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const bodyRef      = useRef<HTMLImageElement>(null);
  const dotLeftRef   = useRef<HTMLImageElement>(null);
  const dotRightRef  = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('illusiaLoaded')) {
      setHidden(true);
      window.dispatchEvent(new Event('illusiaLoaded'));
      return;
    }

    gsap.set(bodyRef.current,     { opacity: 0, y: 60,  scale: 0.88 });
    gsap.set(dotLeftRef.current,  { opacity: 0, y: -80 });
    gsap.set(dotRightRef.current, { opacity: 0, y: -80 });
    gsap.set(wrapRef.current,     { opacity: 1 });

    const tl = gsap.timeline();

    // Phase 1: body swoops up
    tl.to(bodyRef.current, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.75,
      ease: 'power3.out',
    });

    // Phase 2: left dot drops + bounces
    tl.to(dotLeftRef.current, {
      opacity: 1, y: 0,
      duration: 0.65,
      ease: 'bounce.out',
    }, '-=0.1');

    // Phase 3: right dot drops slightly after
    tl.to(dotRightRef.current, {
      opacity: 1, y: 0,
      duration: 0.65,
      ease: 'bounce.out',
    }, '-=0.45');

    // Phase 4: whole logo pulses once
    tl.to(wrapRef.current, {
      scale: 1.05,
      duration: 0.14,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1,
    }, '+=0.25');

    // Phase 5: fly to nav bar
    tl.addLabel('fly');
    const targetY = -(window.innerHeight / 2 - 48);

    tl.to(wrapRef.current, {
      y: targetY,
      scale: 28 / 130,
      duration: 0.78,
      ease: 'power3.inOut',
    }, 'fly');

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 'fly+=0.22');

    tl.to(wrapRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: () => {
        sessionStorage.setItem('illusiaLoaded', '1');
        window.dispatchEvent(new Event('illusiaLoaded'));
        setHidden(true);
      },
    }, 'fly+=0.6');

    return () => { tl.kill(); };
  }, []);

  if (hidden) return null;

  const displayW = 130;
  const displayH = Math.round(130 * (738 / 822));

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  };

  return (
    <>
      <div ref={overlayRef} style={{
        position: 'fixed', inset: 0,
        background: '#000',
        zIndex: 9998,
        pointerEvents: 'none',
      }} />

      <div ref={wrapRef} style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: `-${displayH / 2}px`,
        marginLeft: `-${displayW / 2}px`,
        width: `${displayW}px`,
        height: `${displayH}px`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={bodyRef}     src="/images/illusia-icon-body.png"      alt="Illusia" style={layerStyle} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={dotLeftRef}  src="/images/illusia-icon-dot-left.png"  alt="" style={layerStyle} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={dotRightRef} src="/images/illusia-icon-dot-right.png" alt="" style={layerStyle} />
      </div>
    </>
  );
}
