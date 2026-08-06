'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HERO_CLIPS = [
  '/images/airo-web.mp4',
  '/images/disney-tron-web.mp4',
  '/images/hunger-games-web.mp4',
  '/images/wooooo-energy-web.mp4',
  '/images/innovation-vertiport-web.mp4',
  '/images/mike-tyson-recap-web.mp4',
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clipIndexRef = useRef(0);
  const clipTimesRef = useRef<number[]>(HERO_CLIPS.map(() => 0));
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation (on load)
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { yPercent: 110 });
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(line1Ref.current, { yPercent: 0, duration: 0.9, ease: 'power3.out' })
        .to(line2Ref.current, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, '-=0.72')
        .to(line3Ref.current, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, '-=0.72')
        .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');

      // Scroll-driven animation — pin the hero, animate content out as user scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=50%',
        pin: stickyRef.current,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Fade + scale headline out
          if (headlineRef.current) {
            gsap.set(headlineRef.current, {
              opacity: 1 - p * 2,
              scale: 1 - p * 0.08,
              y: -p * 60,
            });
          }
          // Darken overlay as we scroll out
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { opacity: p * 0.6 });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video) clipTimesRef.current[clipIndexRef.current] = video.currentTime;
      setFading(true);
      setTimeout(() => {
        const next = (clipIndexRef.current + 1) % HERO_CLIPS.length;
        clipIndexRef.current = next;
        const v = videoRef.current;
        if (!v) return;
        const seekAndPlay = () => { v.currentTime = clipTimesRef.current[next]; v.play().catch(() => {}); };
        v.src = HERO_CLIPS[next];
        v.addEventListener('loadedmetadata', seekAndPlay, { once: true });
        v.load();
        setFading(false);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    /* Scroll container — extra height gives scrolling room */
    <div ref={containerRef} style={{ height: '150vh', position: 'relative' }}>
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background video — cycles through sizzle clips */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: fading ? 0 : 0.55,
            transition: 'opacity 0.3s ease',
          }}
          src={HERO_CLIPS[0]}
        />

        {/* Gradient overlay — bottom fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Scroll-driven dark overlay */}
        <div
          ref={overlayRef}
          style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, pointerEvents: 'none' }}
        />

        {/* Headline */}
        <div
          ref={headlineRef}
          style={{
            position: 'relative', zIndex: 10,
            textAlign: 'center',
            padding: '0 24px',
            maxWidth: '960px',
          }}
        >
          <p className="section-label" style={{ marginBottom: '28px' }}>Content Production Agency</p>

          <h1 style={{
            fontSize: 'clamp(48px, 6.8vw, 88px)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#fff',
            textAlign: 'center',
          }}>
            <div style={{ overflow: 'hidden' }}><span ref={line1Ref} style={{ display: 'block' }}>We make content</span></div>
            <div style={{ overflow: 'hidden' }}><span ref={line2Ref} style={{ display: 'block', fontWeight: 800, color: '#fff' }}>impossible to</span></div>
            <div style={{ overflow: 'hidden' }}><span ref={line3Ref} style={{ display: 'block' }}>scroll past.</span></div>
          </h1>

          <div ref={subRef} style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.55)', maxWidth: '520px', lineHeight: 1.6 }}>
              50+ brands. Hundreds of millions of views. One team that treats your brand like it&apos;s the only one.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href="#work"
                onClick={e => { e.preventDefault(); document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ background: '#fff', color: '#000', borderRadius: '4px', padding: '13px 28px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}
              >
                See Our Work
              </a>
              <a
                href="mailto:parker@illusiaagency.com?subject=We%27re%20Interested%20In%20Working%20Together!"
                style={{ background: 'transparent', color: '#fff', borderRadius: '4px', padding: '13px 28px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                Work With Us
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          opacity: 0.4,
        }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, #fff, transparent)' }} />
        </div>
      </div>
    </div>
  );
}
