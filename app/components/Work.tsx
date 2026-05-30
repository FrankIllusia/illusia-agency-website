'use client';

'use client';

/* ── Work / Projects section ─────────────────────────────────────────────────
   Kursza-inspired grid: full-width cards, hover glow, category + client label.
   Replace placeholder images with real campaign assets.
──────────────────────────────────────────────────────────────────────────── */

const projects = [
  {
    id: 1,
    client: 'Tyson 2.0',
    title: 'Cannabis Universe Campaign',
    category: 'AI Content · Brand',
    year: '2024',
    img: '/images/work/tyson.jpg',
    wide: true,
  },
  {
    id: 2,
    client: 'Client Name',
    title: 'Project Title',
    category: 'Video · Social',
    year: '2024',
    img: '/images/work/placeholder-1.jpg',
    wide: false,
  },
  {
    id: 3,
    client: 'Client Name',
    title: 'Project Title',
    category: 'Branding · Identity',
    year: '2024',
    img: '/images/work/placeholder-2.jpg',
    wide: false,
  },
  {
    id: 4,
    client: 'Client Name',
    title: 'Project Title',
    category: 'AI Content · Campaign',
    year: '2025',
    img: '/images/work/placeholder-3.jpg',
    wide: false,
  },
  {
    id: 5,
    client: 'Client Name',
    title: 'Project Title',
    category: 'Video Marketing',
    year: '2025',
    img: '/images/work/placeholder-4.jpg',
    wide: false,
  },
];

export default function Work() {
  return (
    <section id="work" style={{ padding: '16px', background: 'transparent' }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '80px 48px',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '64px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '14px', color: 'rgba(0,0,0,0.45)' }}>Selected Work</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#000' }}>
              The Work
            </h2>
          </div>
          <a href="#contact" style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '2px' }}>
            View All Projects →
          </a>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '16px',
        }}>
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="project-card"
              style={{
                gridColumn: p.wide ? 'span 8' : 'span 4',
                aspectRatio: p.wide ? undefined : '4/5',
                minHeight: p.wide ? '420px' : undefined,
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#111',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.08)',
                /* Responsive fallback handled by media query below */
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={`${p.client} — ${p.title}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />

                {/* Placeholder gradient when no real image */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(135deg, #${['111', '0a0a14', '0d0d0d', '0a1010', '0d0a0a', '101010'][i % 6]} 0%, #1a1a1a 100%)`,
                  zIndex: 0,
                }} />

                {/* Info overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '24px 20px 20px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  zIndex: 2,
                }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {p.client} · {p.year}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    {p.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .project-card { grid-column: span 12 !important; aspect-ratio: 16/9 !important; }
        }
        @media (max-width: 600px) {
          .project-card { grid-column: span 12 !important; aspect-ratio: 4/3 !important; }
        }
      `}</style>
      </div>
    </section>
  );
}
