'use client';

import { useRef } from 'react';
import { Reveal, RiseIn } from './fx';

const team = [
  { name: 'Parker Russo',       role: 'Co-Founder, Chief Executive Officer',        img: '/images/team/parker.jpg'  },
  { name: 'Danny Drew',         role: 'Co-Founder, Director of Videography',        img: '/images/team/danny.jpg'   },
  { name: 'Frank Bonilla',      role: 'Managing Director, Lead Videographer',       img: '/images/team/frank.jpg'   },
  { name: 'Jack Masella',       role: 'Lead Editor, Videographer',                  img: '/images/team/jack.jpg'    },
  { name: 'Chris Corradino',    role: 'Lead Director, Videographer',                img: '/images/team/chris.jpg'   },
  { name: 'Brian Kohn',         role: 'Administrative Director',                    img: '/images/team/brian.jpg'   },
  { name: 'Kiley Baker',        role: 'Social Media Manager',                       img: '/images/team/kiley-v2.jpg' },
  { name: '"Juice" Sherard',    role: 'Videographer, Editor',                       img: '/images/team/juice.jpg'   },
  { name: 'Joe Gervase',        role: 'Editor',                                     img: '/images/team/joe.jpg'     },
  { name: 'Anthony Densieski',  role: 'Editor, Videographer',                       img: '/images/team/tony.jpg'    },
  { name: 'Brendan Yasuk',      role: 'Marketing Coordinator',                      img: '/images/team/brendan.jpg' },
  { name: 'Cory Morales',       role: 'Videographer, Editor, Social Media Manager', img: '/images/team/cory.jpg'    },
  { name: 'Nolan Mariziti',     role: 'Editor',                                     img: '/images/team/nolan.jpg'   },
  { name: 'Sofia Lynn',         role: 'Social Media Manager',                       img: '/images/team/sofia-v2.jpg' },
  { name: 'Jason Keats',        role: 'Social Media Manager',                       img: '/images/team/jason.jpg'   },
  { name: 'Kevin Drew',         role: 'Podcast Production Manager',                 img: '/images/team/kevin.jpg'   },
  { name: 'Alex "Lecky" Harford', role: 'Videographer',                             img: '/images/team/lecky.jpg'   },
  { name: 'Jordin Hugger',      role: 'Content & Brand Coordinator',                img: '/images/team/jordin.jpg'  },
];

const CARD_WIDTH = 280;
const GAP = 24;
const SCROLL_BY = CARD_WIDTH + GAP;

export default function Team() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === 'right' ? SCROLL_BY * 3 : -SCROLL_BY * 3, behavior: 'smooth' });
  };

  return (
    <section
      id="team"
      style={{ padding: '120px 0 128px', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', marginBottom: '64px' }}>
        <Reveal y={18} duration={0.7}>
          <p className="section-label" style={{ marginBottom: '14px' }}>The People</p>
        </Reveal>
        <RiseIn delay={0.08}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#fff' }}>
            Our Team
          </h2>
        </RiseIn>
      </div>

      {/* Carousel */}
      <div style={{ position: 'relative' }}>

        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="team-arrow"
          style={{
            position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 10,
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          ‹
        </button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="team-track"
          style={{
            display: 'flex',
            gap: `${GAP}px`,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            padding: '8px 0 8px 48px',
            cursor: 'grab',
          }}
        >
          {team.map(member => (
            <div
              key={member.name}
              className="team-card"
              style={{
                flex: `0 0 ${CARD_WIDTH}px`,
                scrollSnapAlign: 'start',
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
                }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.img}
                  alt={member.name}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: member.name.includes('Kiley') ? 'contain' : 'cover',
                    objectPosition: member.name.includes('Jordin') ? '30% top' : 'top',
                    transform: member.name.includes('Jordin')
                      ? 'scale(1.04) translateY(2%)'
                      : member.name.includes('Brendan')
                        ? 'scale(1.1)'
                        : undefined,
                    backgroundColor: member.name.includes('Kiley') ? '#d6d6d6' : undefined,
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

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="team-arrow"
          style={{
            position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 10,
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          ›
        </button>

        {/* Edge fades */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '0', pointerEvents: 'none',
          background: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '0', pointerEvents: 'none',
          background: 'none',
        }} />
      </div>

      {/* Social Icons */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ marginTop: '128px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <p className="section-label">Holler At Us</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            {[
              {
                href: 'https://www.instagram.com/illusiaagency',
                label: 'Instagram',
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/></svg>,
              },
              {
                href: 'https://www.facebook.com/illusiaagency/',
                label: 'Facebook',
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
              },
              {
                href: 'https://www.tiktok.com/@illusiaagency',
                label: 'TikTok',
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>,
              },
              {
                href: 'https://www.youtube.com/@IllusiaAgency',
                label: 'YouTube',
                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#2d2d2d" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
              },
              {
                href: 'https://www.linkedin.com/company/100301560/admin/dashboard/',
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
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
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

      <style>{`
        @media (max-width: 700px) {
          /* Vertical two-up grid on phones — the sideways carousel becomes a
             normal scroll-down layout and the arrows disappear. */
          .team-track {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 16px !important;
            overflow-x: visible !important;
            padding: 0 24px !important;
          }
          .team-card { flex: none !important; width: auto !important; }
          .team-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
