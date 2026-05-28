'use client';

/* ── Team section ─────────────────────────────────────────────────────────── */

const team = [
  {
    name: 'Frank Bonilla',
    role: 'Founder & Creative Director',
    img: '/images/team/frank.jpg',
    handle: '@iillusia_father',
  },
  {
    name: 'Parker',
    role: 'Operations & Strategy',
    img: '/images/team/parker.jpg',
    handle: '',
  },
  // Add more team members here
];

export default function Team() {
  return (
    <section id="team" style={{ padding: '120px 0', background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ marginBottom: '64px' }}>
          <p className="section-label" style={{ marginBottom: '14px' }}>The People</p>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#fff' }}>
            Our Team
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {team.map(m => (
            <div key={m.name} className="project-card" style={{ background: '#0a0a0a', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Photo */}
              <div style={{ aspectRatio: '3/4', background: '#111', position: 'relative', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={m.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                  zIndex: 0,
                }} />
              </div>
              {/* Info */}
              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>{m.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>{m.role}</p>
                {m.handle && (
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '6px' }}>{m.handle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
