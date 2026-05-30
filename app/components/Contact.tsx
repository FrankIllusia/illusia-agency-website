'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header label
      gsap.set('.contact-label', { yPercent: 110 });
      ScrollTrigger.create({
        trigger: '.contact-label-wrap',
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to('.contact-label', { yPercent: 0, duration: 0.75, ease: 'power3.out' }),
      });

      // Header heading
      gsap.set('.contact-heading', { yPercent: 105 });
      ScrollTrigger.create({
        trigger: '.contact-heading-wrap',
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to('.contact-heading', { yPercent: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }),
      });

      // Form
      gsap.set('.contact-form', { yPercent: 40, opacity: 0 });
      ScrollTrigger.create({
        trigger: '.contact-form',
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to('.contact-form', { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 }),
      });

      // Footer
      gsap.set('.contact-footer', { yPercent: 40, opacity: 0 });
      ScrollTrigger.create({
        trigger: '.contact-footer',
        start: 'top 95%',
        once: true,
        onEnter: () => gsap.to('.contact-footer', { yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const inputStyle = (name: string) => ({
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
  });

  return (
    <section ref={sectionRef} id="contact" style={{ padding: '96px 0 80px', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header — left aligned */}
        <div style={{ marginBottom: '64px' }}>
          <div className="contact-label-wrap" style={{ overflow: 'hidden', display: 'inline-block' }}>
            <p className="section-label contact-label" style={{ marginBottom: '14px' }}>Let&apos;s Build</p>
          </div>
          <div className="contact-heading-wrap" style={{ overflow: 'hidden' }}>
            <h2 className="contact-heading" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#fff', lineHeight: 1.05 }}>
              Ready to elevate your brand?
            </h2>
          </div>
        </div>

        {/* Contact Form — centered */}
        <div className="contact-form" style={{ maxWidth: '680px', margin: '0 auto 80px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '18px', color: '#fff', fontWeight: 500, marginBottom: '8px' }}>We&apos;ll be in touch.</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Thanks for reaching out — we typically respond within 24 hours.</p>
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* First + Last name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>First Name</label>
                  <input
                    type="text" required placeholder="Parker"
                    style={inputStyle('first')}
                    onFocus={() => setFocused('first')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Last Name</label>
                  <input
                    type="text" required placeholder="Russo"
                    style={inputStyle('last')}
                    onFocus={() => setFocused('last')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Email</label>
                <input
                  type="email" required placeholder="you@company.com"
                  style={inputStyle('email')}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Business Name */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Business Name</label>
                <input
                  type="text" required placeholder="Illusia Agency"
                  style={inputStyle('business')}
                  onFocus={() => setFocused('business')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Project Description */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Project Description</label>
                <textarea
                  required rows={5} placeholder="Tell us about your project, goals, and timeline..."
                  style={{ ...inputStyle('project'), resize: 'vertical' } as React.CSSProperties}
                  onFocus={() => setFocused('project')}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '16px 40px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  fontFamily: 'inherit',
                  alignSelf: 'flex-start',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
              >
                Submit
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="contact-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em', color: '#fff', textTransform: 'uppercase' }}>
            Illusia Agency
          </span>
          <div style={{ display: 'flex', gap: '28px' }}>
            {[
              { label: 'Instagram', href: 'https://instagram.com/illusiaagency' },
              { label: 'Email', href: 'mailto:parker@illusiaagency.com' },
            ].map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.06em' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
              >
                {l.label}
              </a>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>© 2025 Illusia Agency</span>
        </div>

      </div>
    </section>
  );
}
