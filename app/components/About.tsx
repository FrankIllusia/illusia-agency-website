'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHARS = '0123456789';

function scrambleTo(el: HTMLElement, finalValue: string, duration = 1.1) {
  const numeric = finalValue.replace(/[^0-9]/g, '');
  const prefix  = finalValue.replace(/[0-9]+/, '');   // e.g. "" for "2023"
  const suffix  = finalValue.slice(numeric.length + prefix.length - (prefix.length ? prefix.length : 0));

  if (!numeric) {
    // Pure text (NJ/NYC) — character scramble
    let iterations = 0;
    const totalFrames = Math.floor(duration * 30);
    const interval = setInterval(() => {
      el.textContent = finalValue
        .split('')
        .map((char, i) => {
          if (char === '/' || char === '+' || char === ' ') return char;
          if (iterations / totalFrames > i / finalValue.length) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      iterations++;
      if (iterations >= totalFrames) {
        el.textContent = finalValue;
        clearInterval(interval);
      }
    }, 1000 / 30);
    return;
  }

  // Numeric scramble — count up with random digit noise
  const target = parseInt(numeric, 10);
  let frame = 0;
  const totalFrames = Math.floor(duration * 50);

  const interval = setInterval(() => {
    const progress = frame / totalFrames;
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(eased * target);

    // Add digit noise during early frames
    const noise = progress < 0.85
      ? String(current + Math.floor(Math.random() * (target * 0.08)))
          .slice(0, String(target).length)
      : String(current);

    el.textContent = finalValue.replace(numeric, noise.padStart(0, '0'));
    frame++;
    if (frame > totalFrames) {
      el.textContent = finalValue;
      clearInterval(interval);
    }
  }, 1000 / 50);
}

export default function About() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const statEls = statsRef.current?.querySelectorAll('[data-stat]');
          statEls?.forEach((el, i) => {
            const final = el.getAttribute('data-stat') || '';
            setTimeout(() => scrambleTo(el as HTMLElement, final, 1.1), i * 120);
          });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" style={{ background: 'transparent', padding: '100px 0 120px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>

        {/* Label + divider */}
        <p className="section-label" style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.35)' }}>
          Who We Are
        </p>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '56px' }} />

        {/* Large statement */}
        <h2 style={{
          fontSize: 'clamp(24px, 3.2vw, 52px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          marginBottom: '80px',
        }}>
          A creative production company built for brands and public figures worldwide.
        </h2>

        {/* Image + text row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}>
          {/* Left — image */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '4/3',
            background: '#111',
            position: 'relative',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about.jpg"
              alt="Illusia in the field"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
            }} />
          </div>

          {/* Right — description + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              maxWidth: '480px',
            }}>
              We become the full content marketing arm of your business — managing strategy, production, and distribution so your brand shows up with consistency and authority across every platform. Every partner we take on gets a team fully committed to building a high-end, trustworthy presence worth following.
            </p>

            {/* Stats */}
            <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '360px' }}>
              {[
                { stat: '800M+', label: 'Organic views' },
                { stat: '50+',   label: 'Active brands' },
                { stat: '2023',  label: 'Founded' },
                { stat: 'NJ/NYC', label: 'HQ' },
              ].map(item => (
                <div key={item.stat} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <p
                    data-stat={item.stat}
                    style={{ fontSize: '24px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}
                  >
                    —
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <a
                href="mailto:parker@illusiaagency.com"
                style={{
                  width: '52px', height: '52px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none',
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.08)')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)')}
              >
                <span style={{ fontSize: '20px', color: '#000', lineHeight: 1 }}>↗</span>
              </a>
              <a
                href="mailto:parker@illusiaagency.com"
                style={{
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                }}
              >
                Work With Us
              </a>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          #about .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
