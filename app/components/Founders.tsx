'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Founders() {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef  = useRef<HTMLDivElement>(null);
  const photoRef     = useRef<HTMLImageElement>(null);
  const outlineRef   = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Label reveal ───────────────────────────────────────────────────────
      gsap.set('.founders-label', { yPercent: 110 });
      ScrollTrigger.create({
        trigger: '.founders-label-wrap',
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to('.founders-label', { yPercent: 0, duration: 0.75, ease: 'power3.out' }),
      });

      // ── Scale-in on enter ──────────────────────────────────────────────────
      gsap.fromTo(containerRef.current,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // ── Parallax ───────────────────────────────────────────────────────────
      gsap.fromTo(parallaxRef.current,
        { y: 50 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // ── Photo → Outline scrub (full crossfade) ─────────────────────────────
      // Photo fades OUT while edge-detection outline fades IN → black bg + white lines
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 35%',
        end: 'bottom 15%',
        scrub: 1.5,
        onUpdate: self => {
          if (!photoRef.current || !outlineRef.current) return;
          gsap.set(photoRef.current,   { opacity: 1 - self.progress });
          gsap.set(outlineRef.current, { opacity: self.progress });
        },
      });

      // ── Names slide up ─────────────────────────────────────────────────────
      gsap.set(['.founder-name-left', '.founder-name-right'], { yPercent: 120, opacity: 0 });
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap.to('.founder-name-left',  { yPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.18 });
          gsap.to('.founder-name-right', { yPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.32 });
        },
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="founders"
      style={{ padding: '100px 0 140px', background: 'transparent' }}
    >
      {/*
        SVG edge-detection filter.
        grayscale → gaussian blur → difference blend (|original − blur| = edges) → amplify
        Result: thin white outlines on a near-black field.
      */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter
            id="founders-edge"
            x="-5%" y="-5%" width="110%" height="110%"
            colorInterpolationFilters="sRGB"
          >
            {/* Step 1 – desaturate */}
            <feColorMatrix type="saturate" values="0" result="gray" />
            {/* Step 2 – blur to get neighbourhood average */}
            <feGaussianBlur in="gray" stdDeviation="3" result="blurred" />
            {/* Step 3 – difference: pixels at edges diverge from their blurred neighbours */}
            <feBlend in="gray" in2="blurred" mode="difference" result="edges" />
            {/* Step 4 – amplify so faint edges become visible white lines */}
            <feComponentTransfer in="edges">
              <feFuncR type="linear" slope="18" intercept="0" />
              <feFuncG type="linear" slope="18" intercept="0" />
              <feFuncB type="linear" slope="18" intercept="0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>

        {/* Label */}
        <div
          className="founders-label-wrap"
          style={{ overflow: 'hidden', display: 'inline-block', marginBottom: '40px' }}
        >
          <p className="section-label founders-label">Meet the Founders</p>
        </div>

        {/* ── Image block ───────────────────────────────────────────────────── */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            /* 4:3 crops portrait image to approx head → belly-button */
            aspectRatio: '4 / 3',
            background: '#000',
          }}
        >
          {/* Parallax wrapper — both layers move together */}
          <div
            ref={parallaxRef}
            style={{
              position: 'absolute',
              width: '100%',
              height: '115%',
              top: '-7.5%',
              left: 0,
            }}
          >
            {/* Base photo — fades out on scroll */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={photoRef}
              src="/images/founders.png"
              alt="Parker Russo and Danny Drew, co-founders of Illusia Agency"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 0%',
                display: 'block',
              }}
            />

            {/* Outline layer — edge-detect filter, fades in on scroll */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={outlineRef}
              src="/images/founders.png"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 0%',
                display: 'block',
                opacity: 0,
                filter: 'url(#founders-edge)',
              }}
            />
          </div>

          {/* Gradient so names stay legible in both photo and outline states */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 38%)',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Name captions */}
          <div style={{
            position: 'absolute', bottom: '7%',
            left: 0, right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 7%',
            zIndex: 3,
            pointerEvents: 'none',
          }}>

            <div style={{ overflow: 'hidden' }}>
              <div className="founder-name-left">
                <p style={{
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}>Parker Russo</p>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>Co-Founder</p>
              </div>
            </div>

            <div style={{ overflow: 'hidden', textAlign: 'right' }}>
              <div className="founder-name-right">
                <p style={{
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}>Danny Drew</p>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>Co-Founder</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
