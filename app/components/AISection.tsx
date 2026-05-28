'use client';

/* ── AI Section ───────────────────────────────────────────────────────────── */

const tools = [
  { name: 'Runway', desc: 'Gen-3 video generation', category: 'Video' },
  { name: 'Midjourney', desc: 'Cinematic image creation', category: 'Image' },
  { name: 'Kling', desc: 'Motion & animation', category: 'Video' },
  { name: 'Suno', desc: 'AI music composition', category: 'Audio' },
  { name: 'ElevenLabs', desc: 'Voiceover & audio', category: 'Audio' },
  { name: 'Veo', desc: 'Next-gen video AI', category: 'Video' },
];

export default function AISection() {
  return (
    <section id="ai" style={{ padding: '120px 0', background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          {/* Left — copy */}
          <div>
            <p className="section-label" style={{ marginBottom: '14px' }}>AI Expertise</p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, color: '#fff', marginBottom: '28px' }}>
              We operate at the frontier of AI content.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '20px', maxWidth: '480px' }}>
              While other agencies are still figuring out how to use AI, we&apos;ve already built an entire production system around it. Illusia OS automates the pipeline from script to final delivery — so we can produce at a quality and speed that&apos;s impossible any other way.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: '480px' }}>
              Every tool in our stack is chosen for one reason: it raises the bar on what&apos;s possible. Film-grade output. Brand-accurate worlds. Every time.
            </p>

            <div style={{ marginTop: '48px', display: 'flex', gap: '48px' }}>
              {[
                { stat: '10×', label: 'Faster production' },
                { stat: '6+', label: 'AI tools in-house' },
                { stat: '100%', label: 'AI-native team' },
              ].map(item => (
                <div key={item.stat}>
                  <p style={{ fontSize: '36px', fontWeight: 500, color: '#fff', letterSpacing: '-0.03em' }}>{item.stat}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.04em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — tool grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {tools.map(t => (
              <div
                key={t.name}
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  transition: 'border-color 0.2s, background 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>{t.category}</p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>{t.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #ai > div > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
