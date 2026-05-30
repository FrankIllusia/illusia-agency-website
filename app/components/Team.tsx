'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const team = [
  { name: 'Parker Russo',       role: 'Co-Founder, Chief Executive Officer',        img: '/images/team/parker.jpg'  },
  { name: 'Danny Drew',         role: 'Co-Founder, Director of Videography',        img: '/images/team/danny.jpg'   },
  { name: 'Frank Bonilla',      role: 'Managing Director, Lead Videographer',       img: '/images/team/frank.jpg'   },
  { name: 'Jack Masella',       role: 'Lead Editor, Videographer',                  img: '/images/team/jack.jpg'    },
  { name: 'Chris Corradino',    role: 'Lead Director, Videographer',                img: '/images/team/chris.jpg'   },
  { name: 'Brian Kohn',         role: 'Administrative Director',                    img: '/images/team/brian.jpg'   },
  { name: 'Kiley Baker',        role: 'Social Media Manager',                       img: '/images/team/kiley.jpg'   },
  { name: '"Juice" Sherard',    role: 'Videographer, Editor',                       img: '/images/team/juice.jpg'   },
  { name: 'Joe Gervase',        role: 'Editor',                                     img: '/images/team/joe.jpg'     },
  { name: 'Anthony Densieski',  role: 'Editor, Videographer',                       img: '/images/team/tony.jpg'    },
  { name: 'Brendan Yasuk',      role: 'Marketing Coordinator',                      img: '/images/team/brendan.jpg' },
  { name: 'Cory Morales',       role: 'Videographer, Editor, Social Media Manager', img: '/images/team/cory.jpg'    },
  { name: 'Nolan Mariziti',     role: 'Editor',                                     img: '/images/team/nolan.jpg'   },
  { name: 'James Hart',         role: 'Videographer, Editor',                       img: '/images/team/james.jpg'   },
  { name: 'Sofia Lynn',         role: 'Social Media Manager',                       img: '/images/team/sofia.jpg'   },
  { name: 'Jason Keats',        role: 'Social Media Manager',                       img: '/images/team/jason.jpg'   },
  { name: 'Kevin Drew',         role: 'Podcast Production Manager',                 img: '/images/team/kevin.jpg'   },
];

// Groups: Parker+Danny first, then 3 at a time
const groups = [
  team.slice(0, 2),
  team.slice(2, 5),
  team.slice(5, 8),
  team.slice(8, 11),
  team.slice(11, 14),
  team.slice(14, 17),
];

export default function Team() {
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs  = useRef<Map<string, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    const ctx = gsap.context(() => {
      groups.forEach((group, gi) => {
        const cards = group
          .map(m => cardRefs.current.get(m.name))
          .filter(Boolean) as HTMLDivElement[];

        gsap.set(cards, { opacity: 0, y: 80, scale: 0.96 });

        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: groupRefs.current[gi],
            start: 'top 92%',
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="team"
      style={{ padding: '120px 0 128px', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '100px' }}>
          <p className="section-label" style={{ marginBottom: '14px' }}>The People</p>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#fff' }}>
            Our Team
          </h2>
        </div>

        {/* Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {groups.map((group, gi) => (
            <div
              key={gi}
              ref={el => { groupRefs.current[gi] = el; }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              {group.map(member => (
                <div
                  key={member.name}
                  ref={el => { cardRefs.current.set(member.name, el); }}
                  className="project-card"
                  style={{
                    flex: '0 0 280px',
                    width: '280px',
                    background: '#0a0a0a',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Photo */}
                  <div style={{ aspectRatio: '3/4', background: '#111', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                      zIndex: 0,
                    }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.img}
                      alt={member.name}
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'top',
                        zIndex: 1,
                        filter: 'grayscale(100%)',
                      }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>
                      {member.name}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em', lineHeight: 1.5 }}>
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div style={{ marginTop: '128px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <p className="section-label">Holler At Us</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {[
            {
              href: '#',
              label: 'Instagram',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/></svg>,
            },
            {
              href: '#',
              label: 'Facebook',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
            },
            {
              href: '#',
              label: 'TikTok',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>,
            },
            {
              href: '#',
              label: 'YouTube',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#2d2d2d" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
            },
            {
              href: '#',
              label: 'LinkedIn',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
            },
          ].map(({ href, label, svg }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'background 0.2s, transform 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              {svg}
            </a>
          ))}
        </div>
        </div>

      </div>
    </section>
  );
}
