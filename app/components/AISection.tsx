'use client';

/* ── AI Showcase section ─────────────────────────────────────────────────────
   One clean section showing AI-generated work examples.
   Swap placeholder items for real Runway/MJ outputs.
──────────────────────────────────────────────────────────────────────────── */

const examples = [
  {
    id: 1,
    title: 'Tyson 2.0 — Cannabis Universe',
    type: 'video',
    src: '/images/ai/tyson-ai.mp4',
    poster: '/images/ai/tyson-ai-poster.jpg',
    tool: 'Runway Gen-3',
  },
  {
    id: 2,
    title: 'Product World — Floating',
    type: 'image',
    src: '/images/ai/product-world.jpg',
    tool: 'Midjourney',
  },
  {
    id: 3,
    title: 'Cinematic Brand Film',
    type: 'video',
    src: '/images/ai/brand-film.mp4',
    poster: '/images/ai/brand-film-poster.jpg',
    tool: 'Runway + Kling',
  },
  {
    id: 4,
    title: 'Volumetric Atmosphere',
    type: 'image',
    src: '/images/ai/volumetric.jpg',
    tool: 'Midjourney',
  },
];

function AICard({ item }: { item: typeof examples[0] }) {
  return (
    <div
      className="project-card"
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        aspectRatio: '16/9',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {item.type === 'video' ? (
        <video
          autoPlay muted loop playsInline
          poster={item.poster}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          src={item.src}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}

      {/* Placeholder bg when no asset */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {item.tool}
        </span>
      </div>

      {/* Label overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        padding: '20px 16px 16px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
      }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{item.title}</p>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.tool}</p>
      </div>
    </div>
  );
}

export default function AISection() {
  return (
    <section id="ai" style={{ padding: '16px', background: '#000' }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '80px 48px',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header — minimal */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '14px', color: 'rgba(0,0,0,0.45)' }}>AI-Generated</p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, color: '#000' }}>
              The new frontier of content.
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)', maxWidth: '320px', lineHeight: 1.6, textAlign: 'right' }}>
            A look at what&apos;s possible when AI meets a creative direction worth executing.
          </p>
        </div>

        {/* 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {examples.map(item => <AICard key={item.id} item={item} />)}
        </div>
      </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          #ai > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
