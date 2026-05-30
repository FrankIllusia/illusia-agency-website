'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Services section ─────────────────────────────────────────────────────── */

const services = [
  {
    num: '01',
    title: 'Video Marketing',
    desc: 'Scroll-stopping video that converts. From brand films to social-first campaigns — tailored to every platform, designed for impact.',
    tags: ['Brand Films', 'Social Content', 'Campaign'],
  },
  {
    num: '02',
    title: 'Social Media Strategy',
    desc: "Data-driven organic growth across every major platform. We don't post content — we build audiences.",
    tags: ['Instagram', 'TikTok', 'YouTube'],
  },
  {
    num: '03',
    title: 'AI Content Production',
    desc: 'Cinematic, world-class AI-generated content. Each campaign is its own universe — product-as-protagonist, film-grade color science, volumetric atmosphere.',
    tags: ['Runway', 'Midjourney', 'Suno', 'Kling'],
  },
  {
    num: '04',
    title: 'Branding & Identity',
    desc: 'From brand development to visual identity. Cohesive, memorable brand presence across every medium.',
    tags: ['Identity', 'Visual System', 'Guidelines'],
  },
  {
    num: '05',
    title: 'Website Design',
    desc: 'Premium digital experiences that match your brand level. Custom-built, performance-first, conversion-optimized.',
    tags: ['Web', 'UI/UX', 'Next.js'],
  },
  {
    num: '06',
    title: 'Podcasting',
    desc: 'Full-service audio production that establishes authority and drives growth. Strategy, production, distribution.',
    tags: ['Production', 'Strategy', 'Distribution'],
  },
  {
    num: '07',
    title: 'Live Production',
    desc: 'Full-scale live show production across Kick, Twitch, X, and beyond. We handle everything — custom scene design, OBS builds, and real-time directing so every broadcast runs like a premium production.',
    tags: ['Kick', 'Twitch', 'X', 'OBS'],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header label
      gsap.set('.srv-label', { yPercent: 110 });
      ScrollTrigger.create({
        trigger: '.srv-label-wrap',
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to('.srv-label', { yPercent: 0, duration: 0.75, ease: 'power3.out' }),
      });

      // Header heading
      gsap.set('.srv-heading', { yPercent: 105 });
      ScrollTrigger.create({
        trigger: '.srv-heading-wrap',
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to('.srv-heading', { yPercent: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }),
      });

      // Each service row
      gsap.utils.toArray<HTMLElement>('.srv-row').forEach(row => {
        const num   = row.querySelector('.srv-num');
        const title = row.querySelector('.srv-title');
        const desc  = row.querySelector('.srv-desc');
        const tags  = row.querySelector('.srv-tags');

        gsap.set([num, title, desc, tags].filter(Boolean), { yPercent: 110 });

        ScrollTrigger.create({
          trigger: row,
          start: 'top 87%',
          once: true,
          onEnter: () => {
            gsap.to(num,   { yPercent: 0, duration: 0.65, ease: 'power3.out' });
            gsap.to(title, { yPercent: 0, duration: 0.72, ease: 'power3.out', delay: 0.06 });
            gsap.to(desc,  { yPercent: 0, duration: 0.78, ease: 'power3.out', delay: 0.13 });
            gsap.to(tags,  { yPercent: 0, duration: 0.78, ease: 'power3.out', delay: 0.20 });
          },
        });
      });

      // CTA
      gsap.set('.srv-cta', { yPercent: 110 });
      ScrollTrigger.create({
        trigger: '.srv-cta-wrap',
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to('.srv-cta', { yPercent: 0, duration: 0.8, ease: 'power3.out' }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" style={{ padding: '120px 0 48px', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '80px' }}>
          <div className="srv-label-wrap" style={{ overflow: 'hidden', display: 'inline-block' }}>
            <p className="section-label srv-label" style={{ marginBottom: '14px' }}>What We Do</p>
          </div>
          <div className="srv-heading-wrap" style={{ overflow: 'hidden' }}>
            <h2 className="srv-heading" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#fff', maxWidth: '600px' }}>
              Services built for brands that demand more.
            </h2>
          </div>
        </div>

        {/* Service rows */}
        <div>
          {services.map((s, i) => (
            <div
              key={s.num}
              className="srv-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '32px',
                alignItems: 'start',
                padding: '36px 0',
                borderTop: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                cursor: 'default',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ overflow: 'hidden', paddingTop: '4px' }}>
                <span className="srv-num" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>{s.num}</span>
              </div>
              <div>
                <div style={{ overflow: 'hidden' }}>
                  <h3 className="srv-title" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 500, color: '#fff', marginBottom: '12px' }}>{s.title}</h3>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p className="srv-desc" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '560px' }}>{s.desc}</p>
                </div>
              </div>
              <div style={{ overflow: 'hidden', paddingTop: '4px' }}>
                <div className="srv-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', maxWidth: '200px' }}>
                  {s.tags.map(t => (
                    <span key={t} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '4px 8px', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="srv-cta-wrap" style={{ marginTop: '48px', overflow: 'hidden' }}>
          <div className="srv-cta" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
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

      <style>{`
        @media (max-width: 700px) {
          #services .srv-row { grid-template-columns: 40px 1fr !important; }
          #services .srv-tags { display: none !important; }
        }
      `}</style>
    </section>
  );
}
