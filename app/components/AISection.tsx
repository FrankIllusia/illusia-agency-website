'use client';

import { useRef, useState } from 'react';

const examples = [
  {
    id: 1,
    title: 'Carmelo Anthony — STAYME7O Brooklyn Tour',
    type: 'video',
    src: '/images/ai/carmelo.mp4',
    poster: '/images/ai/carmelo-thumb.png',
    tool: 'Video',
  },
  {
    id: 2,
    title: 'Miami Swim Week — Renuvion',
    type: 'video',
    src: '/images/ai/miami-swim.mp4',
    poster: '/images/ai/miami-swim-thumb.png',
    tool: 'Video',
  },
  {
    id: 3,
    title: 'Illusia × Madison Modern Social Recap',
    type: 'video',
    src: '/images/ai/madison.mp4',
    poster: '/images/ai/madison-thumb.jpg',
    tool: 'Video',
  },
  {
    id: 4,
    title: 'Garmany Goodfellas Promo',
    type: 'video',
    src: '/images/ai/one-shot.mp4',
    poster: '/images/ai/garmany-thumb.png',
    tool: 'Video',
  },
  {
    id: 5,
    title: 'F4',
    type: 'video',
    src: '/images/ai/f4.mp4',
    poster: '/images/ai/f4-thumb.jpg',
    tool: 'Video',
  },
  {
    id: 6,
    title: 'Aegean Love Story',
    type: 'video',
    src: '/images/ai/aegean.mp4',
    poster: '/images/ai/aegean-thumb.jpg',
    tool: 'Video',
  },
  {
    id: 7,
    title: 'Flynnstone Experience',
    type: 'video',
    src: '/images/ai/flynnstone.mp4',
    poster: '/images/ai/flynnstone-thumb.jpg',
    tool: 'Video',
  },
  {
    id: 8,
    title: 'Lifetime Final',
    type: 'video',
    src: '/images/ai/lifetime.mp4',
    poster: '/images/ai/lifetime-thumb.jpg',
    tool: 'Video',
  },
];

function AICard({ item }: { item: typeof examples[0] }) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play(); setPlaying(true); }
    else { vid.pause(); setPlaying(false); }
  };

  return (
    <div
      className="project-card"
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        aspectRatio: '9/16',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Placeholder bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {item.tool}
        </span>
      </div>

      {/* Video — always rendered so it's ready to play */}
      {item.type === 'video' && item.src && (
        <video
          ref={videoRef}
          loop playsInline
          poster={item.poster || undefined}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
          src={item.src}
        />
      )}

      {item.type === 'image' && item.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}

      {/* Play / pause toggle */}
      {item.type === 'video' && item.src && (!playing || hovered) && (
        <button
          onClick={toggle}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: playing ? 'rgba(0,0,0,0.15)' : 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, transition: 'background 0.2s' }}
        >
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s ease, opacity 0.2s',
            opacity: playing ? (hovered ? 1 : 0) : 1,
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}>
            {playing ? (
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '3px', height: '16px', background: '#fff', borderRadius: '2px' }} />
                <div style={{ width: '3px', height: '16px', background: '#fff', borderRadius: '2px' }} />
              </div>
            ) : (
              <div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '16px solid #fff', marginLeft: '3px' }} />
            )}
          </div>
        </button>
      )}

      {/* Label overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
        padding: '20px 16px 16px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{item.title}</p>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.tool}</p>
      </div>
    </div>
  );
}

export default function AISection() {
  return (
    <section id="ai" style={{ padding: '16px', background: 'transparent' }}>
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

        {/* 4-col grid — 2 rows of 4 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {examples.map(item => <AICard key={item.id} item={item} />)}
        </div>
      </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          #ai > div > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
