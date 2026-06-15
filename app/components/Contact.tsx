'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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

  return (
    <section ref={sectionRef} id="contact" style={{ padding: '96px 0 80px', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>

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
