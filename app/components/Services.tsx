'use client';

/* ── Services section ─────────────────────────────────────────────────────── */

const services = [
  {
    num: '01',
    title: 'AI Content Production',
    desc: 'Cinematic, world-class AI-generated content. Each campaign is its own universe — product-as-protagonist, film-grade color science, volumetric atmosphere.',
    tags: ['Runway', 'Midjourney', 'Suno', 'Kling'],
  },
  {
    num: '02',
    title: 'Video Marketing',
    desc: 'Scroll-stopping video that converts. From brand films to social-first campaigns — tailored to every platform, designed for impact.',
    tags: ['Brand Films', 'Social Content', 'Campaign'],
  },
  {
    num: '03',
    title: 'Social Media Strategy',
    desc: "Data-driven organic growth across every major platform. We don't post content — we build audiences.",
    tags: ['Instagram', 'TikTok', 'YouTube'],
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
];

export default function Services() {
  return (
    <section id="services" style={{ padding: '120px 0', background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '80px' }}>
          <p className="section-label" style={{ marginBottom: '14px' }}>What We Do</p>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#fff', maxWidth: '600px' }}>
            Services built for brands that demand more.
          </h2>
        </div>

        {/* Service rows */}
        <div>
          {services.map((s, i) => (
            <div
              key={s.num}
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
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', paddingTop: '4px' }}>{s.num}</span>
              <div>
                <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 500, color: '#fff', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '560px' }}>{s.desc}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', paddingTop: '4px', maxWidth: '200px' }}>
                {s.tags.map(t => (
                  <span key={t} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '4px 8px', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          #services .service-row { grid-template-columns: 40px 1fr !important; }
          #services .service-tags { display: none !important; }
        }
      `}</style>
    </section>
  );
}
