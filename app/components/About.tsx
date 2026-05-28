/* ── About section ────────────────────────────────────────────────────────── */

export default function About() {
  return (
    <section id="about" style={{ padding: '120px 0', background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <p className="section-label" style={{ marginBottom: '14px' }}>About Illusia</p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, color: '#fff', marginBottom: '32px' }}>
              We don&apos;t just create content — we build empires.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '20px' }}>
              Illusia Agency is an AI-native creative production agency that works with the world&apos;s most recognizable brands, celebrities, and fast-growing companies. We craft campaigns that drive real influence and measurable growth.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
              Our in-house team of AI operators, video directors, editors, and strategists deliver cinematic, scroll-stopping content at a speed and quality that wasn&apos;t possible until now.
            </p>

            <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {[
                { stat: '2021', label: 'Founded' },
                { stat: '50+', label: 'Campaigns delivered' },
                { stat: 'NYC', label: 'Headquarters' },
                { stat: 'Global', label: 'Clients' },
              ].map(item => (
                <div key={item.stat} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <p style={{ fontSize: '28px', fontWeight: 500, color: '#fff', letterSpacing: '-0.02em' }}>{item.stat}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.04em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image placeholder */}
          <div style={{
            aspectRatio: '4/5',
            background: '#111',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Replace with real agency photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about.jpg"
              alt="Illusia Agency team"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Agency Photo</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #about > div > div { grid-template-columns: 1fr !important; }
          #about > div > div > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}
