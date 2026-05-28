'use client';

/* ── Contact / Footer section ─────────────────────────────────────────────── */

export default function Contact() {
  return (
    <section id="contact" style={{ padding: '120px 0 80px', background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        {/* CTA block */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 80px' }}>
          <p className="section-label" style={{ marginBottom: '20px' }}>Let&apos;s Build</p>
          <h2 style={{ fontSize: 'clamp(40px, 7vw, 96px)', fontWeight: 500, color: '#fff', lineHeight: 1.0, marginBottom: '36px' }}>
            Ready to elevate your brand?
          </h2>
          <a
            href="mailto:parker@illusiaagency.com?subject=We Want To Work Together!"
            style={{
              display: 'inline-block',
              background: '#fff', color: '#000',
              borderRadius: '4px', padding: '16px 40px',
              fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em',
              textDecoration: 'none', textTransform: 'uppercase',
            }}
          >
            Start a Project
          </a>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
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
