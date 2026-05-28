'use client';

export default function About() {
  return (
    <section id="about" style={{ background: '#000', padding: '100px 0 120px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>

        {/* Label + divider */}
        <p className="section-label" style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.35)' }}>
          Who We Are
        </p>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '56px' }} />

        {/* Large statement */}
        <h2 style={{
          fontSize: 'clamp(24px, 3.2vw, 52px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          marginBottom: '80px',
        }}>
          A creative production company built for brands and public figures worldwide.
        </h2>

        {/* Image + text row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}>
          {/* Left — image */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '4/3',
            background: '#111',
            position: 'relative',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about.jpg"
              alt="Illusia in the field"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
            }} />
          </div>

          {/* Right — description + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              maxWidth: '480px',
            }}>
              Our approach is defined by the needs of the project. We love the full-scale commercial production as much as we love being scrappy in the field — and we bring the same obsession to both. Every brand we work with gets a team that&apos;s fully bought in, month after month.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '360px' }}>
              {[
                { stat: '800M+', label: 'Organic views' },
                { stat: '50+',   label: 'Active brands' },
                { stat: '2021',  label: 'Founded' },
                { stat: 'NJ/NYC', label: 'HQ' },
              ].map(item => (
                <div key={item.stat} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <p style={{ fontSize: '24px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>{item.stat}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <a
                href="mailto:parker@illusiaagency.com"
                style={{
                  width: '52px', height: '52px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none',
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.08)')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)')}
              >
                <span style={{ fontSize: '20px', color: '#000', lineHeight: 1 }}>↗</span>
              </a>
              <a
                href="mailto:parker@illusiaagency.com"
                style={{
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                }}
              >
                Work With Us
              </a>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          #about .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
