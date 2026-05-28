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
      style={{ padding: '120px 0 160px', background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}
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

        {/* CTA */}
        <div style={{ marginTop: '160px', textAlign: 'center' }}>
          <a
            href="/talent"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              padding: '13px 28px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            }}
          >
            Meet the Full Team
            <span style={{ opacity: 0.5 }}>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
