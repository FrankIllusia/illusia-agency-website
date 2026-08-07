'use client';

import { useEffect, useRef, useState } from 'react';
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
    title: 'Generative Content Production',
    desc: 'Cinematic, world-class produced content. Each campaign is its own universe — product-as-protagonist, film-grade color science, volumetric atmosphere.',
    tags: ['Concept', 'Direction', 'Post'],
  },
  {
    num: '04',
    title: 'Branding & Identity',
    desc: 'From brand development to visual identity. Cohesive, memorable brand presence across every medium.',
    tags: ['Identity', 'Visual System', 'Guidelines'],
  },
  {
    num: '05',
    title: 'Live Production',
    desc: 'End-to-end live show production built from scratch. Custom scenes, OBS builds, and real-time directing — every broadcast run like a flagship production.',
    tags: ['Kick', 'Twitch', 'X', 'OBS'],
  },
  {
    num: '06',
    title: 'Website Design',
    desc: 'Premium digital experiences that match your brand level. Custom-built, performance-first, conversion-optimized.',
    tags: ['Web', 'UI/UX', 'Next.js'],
  },
  {
    num: '07',
    title: 'Podcasting',
    desc: 'Full-service audio production that establishes authority and drives growth. Strategy, production, distribution.',
    tags: ['Production', 'Strategy', 'Distribution'],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === name ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '6px',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  });

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

        {/* Contact header */}
        <div style={{ marginTop: '64px', maxWidth: '680px', margin: '64px auto 40px' }}>
          <p className="section-label" style={{ marginBottom: '14px' }}>Let&apos;s Build</p>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#fff', lineHeight: 1.05 }}>
            Ready to elevate your brand?
          </h2>
        </div>

        {/* Contact Form */}
        <div className="srv-cta-wrap" style={{ overflow: 'hidden' }}>
          <div className="srv-cta" style={{ maxWidth: '680px', margin: '0 auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ fontSize: '18px', color: '#fff', fontWeight: 500, marginBottom: '8px' }}>We&apos;ll be in touch.</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Thanks for reaching out — we typically respond within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  setSending(true);
                  setSendError(false);
                  /* The response used to be discarded in a finally block, so a
                     500 from the mail transport still rendered "We'll be in
                     touch." — enquiries were being dropped with the sender
                     told they'd landed. Only confirm on a genuine ok. */
                  try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        firstName: fd.get('firstName'),
                        lastName: fd.get('lastName'),
                        email: fd.get('email'),
                        business: fd.get('business'),
                        description: fd.get('description'),
                      }),
                    });
                    if (!res.ok) throw new Error(`contact endpoint returned ${res.status}`);
                    setSubmitted(true);
                  } catch (err) {
                    console.error(err);
                    setSendError(true);
                  } finally {
                    setSending(false);
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div className="form-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>First Name</label>
                    <input name="firstName" type="text" required placeholder="Jack" style={inputStyle('first')} onFocus={() => setFocused('first')} onBlur={() => setFocused(null)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Last Name</label>
                    <input name="lastName" type="text" required placeholder="Black" style={inputStyle('last')} onFocus={() => setFocused('last')} onBlur={() => setFocused(null)} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Email</label>
                  <input name="email" type="email" required placeholder="you@company.com" style={inputStyle('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Business Name</label>
                  <input name="business" type="text" required placeholder="Business Name" style={inputStyle('business')} onFocus={() => setFocused('business')} onBlur={() => setFocused(null)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Project Description</label>
                  <textarea name="description" required rows={5} placeholder="Tell us about your project, goals, and timeline..." style={{ ...inputStyle('project'), resize: 'vertical' }} onFocus={() => setFocused('project')} onBlur={() => setFocused(null)} />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  style={{ alignSelf: 'flex-start', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', padding: '16px 40px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: sending ? 'wait' : 'pointer', transition: 'opacity 0.2s', fontFamily: 'inherit', opacity: sending ? 0.6 : 1 }}
                  onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                  onMouseLeave={e => { if (!sending) (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                >
                  {sending ? 'Sending...' : 'Submit'}
                </button>
                {sendError && (
                  <p role="alert" style={{ fontSize: '13px', color: '#ff8a8a', lineHeight: 1.6 }}>
                    Something went wrong sending your message. Please email us directly at{' '}
                    <a href="mailto:parker@illusiaagency.com" style={{ color: '#ff8a8a', textDecoration: 'underline' }}>
                      parker@illusiaagency.com
                    </a>.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 700px) {
          #services .srv-row { grid-template-columns: 40px 1fr !important; }
          #services .srv-tags { display: none !important; }
          #services .form-name-grid { grid-template-columns: 1fr !important; }
          /* 16px minimum stops iOS Safari from zooming the page when an input gets focus */
          #services input, #services textarea { font-size: 16px !important; }
        }
      `}</style>
    </section>
  );
}
