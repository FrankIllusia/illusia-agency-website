'use client';

const team = [
  { name: 'Parker Russo',       role: 'Co-Founder, Chief Executive Officer',          img: '/images/team/parker.jpg'  },
  { name: 'Danny Drew',         role: 'Co-Founder, Director of Videography',          img: '/images/team/danny.jpg'   },
  { name: 'Frank Bonilla',      role: 'Managing Director, Executive Producer',        img: '/images/team/frank.jpg'   },
  { name: 'Jack Masella',       role: 'Executive Producer, Videographer',             img: '/images/team/jack.jpg'    },
  { name: 'Chris Corradino',    role: 'Lead Director, Videographer',                  img: '/images/team/chris.jpg'   },
  { name: 'Brian Kohn',         role: 'Head of Operations & Client Strategy',         img: '/images/team/brian.jpg'   },
  { name: 'Kiley Baker',        role: 'Social Media Manager',                         img: '/images/team/kiley.jpg'   },
  { name: '"Juice" Sherard',    role: 'Videographer, Editor',                         img: '/images/team/juice.jpg'   },
  { name: 'Joe Gervase',        role: 'Editor',                                       img: '/images/team/joe.jpg'     },
  { name: 'Anthony Densieski',  role: 'Editor, Videographer',                         img: '/images/team/tony.jpg'    },
  { name: 'Brendan Yasuk',      role: 'Head of Pre-Production Marketing Strategy',    img: '/images/team/brendan.jpg' },
  { name: 'Cory Morales',       role: 'Videographer, Editor, Social Media Manager',   img: '/images/team/cory.jpg'    },
  { name: 'Nolan Mariziti',     role: 'Editor',                                       img: '/images/team/nolan.jpg'   },
  { name: 'Sofia Lynn',         role: 'Social Media Manager',                         img: '/images/team/sofia.jpg'   },
  { name: 'Jason Keats',        role: 'Social Media Manager',                         img: '/images/team/jason.jpg'   },
  { name: 'Kevin Drew',         role: 'Podcast Production Manager',                   img: '/images/team/kevin.jpg'   },
  { name: 'Alex "Lecky" Harford', role: 'Videographer',                               img: '/images/team/lecky.jpg'   },
  { name: 'Jordin Hugger',      role: 'Content & Brand Coordinator',                  img: '/images/team/jordin.jpg'  },
];

export default function TalentPage() {
  return (
    <main style={{ background: '#000', minHeight: '100vh', paddingTop: '64px' }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 32px 64px' }}>
        <p className="section-label" style={{ marginBottom: '14px' }}>04 — Our Talented Team</p>
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 80px)',
          fontWeight: 500,
          color: '#fff',
          letterSpacing: '-0.03em',
          lineHeight: 1.0,
          maxWidth: '640px',
        }}>
          The people<br />
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>behind the work.</span>
        </h1>
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 32px 120px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {team.map(member => (
            <div
              key={member.name}
              className="project-card"
              style={{
                background: '#0a0a0a',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Photo */}
              <div style={{ aspectRatio: '3/4', background: '#111', position: 'relative', overflow: 'hidden' }}>
                {/* Gradient fallback shown behind image */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                  zIndex: 0,
                }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.img}
                  alt={member.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
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
      </div>

      {/* ── CTA strip ────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
          <p className="section-label">Work with us</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 500, color: '#fff', maxWidth: '600px', lineHeight: 1.1 }}>
            Ready to build something exceptional?
          </h2>
          <a
            href="mailto:parker@illusiaagency.com"
            style={{
              background: '#fff',
              color: '#000',
              borderRadius: '4px',
              padding: '13px 28px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>

    </main>
  );
}
