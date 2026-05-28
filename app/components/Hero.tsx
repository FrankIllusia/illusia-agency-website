'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation (on load)
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(line1Ref.current, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .fromTo(line2Ref.current, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
        .fromTo(line3Ref.current, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
        .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');

      // Scroll-driven animation — pin the hero, animate content out as user scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=120%',
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

  return (
    /* Scroll container — extra height gives scrolling room */
    <div ref={containerRef} style={{ height: '220vh', position: 'relative' }}>
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
        {/* Background video / image */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.55,
          }}
          /* swap src for real reel video once available */
          src="/images/hero-reel.mp4"
          poster="/images/hero-poster.jpg"
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
          <p className="section-label" style={{ marginBottom: '28px' }}>Creative Production Agency</p>

          <h1 style={{
            fontSize: 'clamp(52px, 9vw, 120px)',
            fontWeight: 500,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            overflow: 'hidden',
            color: '#fff',
          }}>
            <span ref={line1Ref} style={{ display: 'block' }}>We don&apos;t</span>
            <span ref={line2Ref} style={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>just</span>
            <span ref={line3Ref} style={{ display: 'block' }}>make content.</span>
          </h1>

          <div ref={subRef} style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.55)', maxWidth: '480px', lineHeight: 1.6 }}>
              AI-powered cinematic production for brands that demand the highest level.
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
                href="mailto:parker@illusiaagency.com"
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
