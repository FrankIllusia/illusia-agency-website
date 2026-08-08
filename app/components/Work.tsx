'use client';

import { useState, useRef } from 'react';
import { Reveal, RiseIn } from './fx';

/* ── Work / Projects section ─────────────────────────────────────────────────
   Kursza-inspired grid: full-width cards, hover glow, category + client label.
   Replace placeholder images with real campaign assets.
──────────────────────────────────────────────────────────────────────────── */

const projects = [
  {
    id: 1,
    client: 'Illusia Agency',
    title: 'Behind The Brand — Episode 2',
    category: 'Ciara Times Square',
    year: '2025',
    img: '/images/work/ciara-thumb.jpg',
    thumbnail: '/images/work/ciara-thumb.jpg',
    youtubeId: 'NY8deUujC1U',
    wide: true,
  },
  {
    id: 2,
    client: 'Illusia Agency',
    title: 'Devil Wears Prada 2',
    category: '20th Century Studios',
    year: '2024',
    img: '/images/work/ig-thumb-1.png',
    videoSrc: '/images/work/dwp2-sizzle-web.mp4',
    thumbnail: '/images/work/ig-thumb-1.png',
    wide: false,
  },
  {
    id: 3,
    client: 'Rove',
    title: 'Rove - Summer Launch Hero',
    category: 'Branding · Identity',
    year: '2024',
    img: '/images/work/rove-thumb.png',
    videoSrc: '/images/work/rove-web.mp4',
    thumbnail: '/images/work/rove-thumb.png',
    wide: false,
  },
  {
    id: 4,
    client: 'Vertiports',
    title: 'Joby NYC Launch',
    category: 'Illusia Agency 2026',
    year: '2026',
    img: '/images/work/joby.png',
    videoSrc: '/images/work/ig-reel-5.mp4',
    thumbnail: '/images/work/joby.png',
    wide: false,
  },
  {
    id: 5,
    client: '20th Century Fox',
    title: 'Predator Red Carpet Premiere',
    category: 'Video Marketing',
    year: '2025',
    img: '/images/work/predator-thumb.png',
    videoSrc: '/images/work/predator-web.mp4',
    thumbnail: '/images/work/predator-thumb.png',
    thumbPosition: 'center 100%',
    wide: false,
  },
];

export default function Work() {
  const [playing, setPlaying] = useState<number | null>(null);
  // Cards whose video has started at least once — keeps the thumbnail from
  // covering the paused frame when the user pauses mid-video.
  const [started, setStarted] = useState<Set<number>>(new Set());
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  return (
    <>
      <section id="work" style={{ padding: '16px', background: 'transparent' }}>
        <div className="work-shell" style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '80px 48px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '64px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <Reveal y={18} duration={0.7}>
                  <p className="section-label" style={{ marginBottom: '14px', color: 'rgba(0,0,0,0.45)' }}>Selected Work</p>
                </Reveal>
                <RiseIn delay={0.08}>
                  <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, color: '#000' }}>
                    The Work
                  </h2>
                </RiseIn>
              </div>
              <Reveal delay={0.2}>
                <a href="#contact" style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '2px' }}>
                  View All Projects →
                </a>
              </Reveal>
            </div>

            {/* Grid — Reveal *is* the grid container, so the cards stay direct
                children and the layout is unchanged; they stagger in on enter. */}
            <Reveal stagger={0.14} y={80} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
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
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>

                    {'youtubeId' in p && p.youtubeId ? (
                      playing === p.id ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${p.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                          title={`${p.client} — ${p.title}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block', zIndex: 1 }}
                        />
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.thumbnail}
                            alt={`${p.client} — ${p.title}`}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%', display: 'block', zIndex: 0 }}
                          />
                          <button
                            onClick={() => setPlaying(p.id)}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
                            onMouseEnter={e => { const btn = e.currentTarget.querySelector('.yt-play') as HTMLElement; if (btn) btn.style.transform = 'scale(1.1)'; }}
                            onMouseLeave={e => { const btn = e.currentTarget.querySelector('.yt-play') as HTMLElement; if (btn) btn.style.transform = 'scale(1)'; }}
                          >
                            <div className="yt-play" style={{
                              width: '72px', height: '72px',
                              borderRadius: '50%',
                              background: 'rgba(0,0,0,0.55)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(255,255,255,0.25)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'transform 0.2s ease',
                            }}>
                              <div style={{ width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '22px solid #fff', marginLeft: '5px' }} />
                            </div>
                          </button>
                        </>
                      )
                    ) : 'videoSrc' in p && p.videoSrc ? (
                      <>
                        <video
                          ref={el => { videoRefs.current[p.id] = el; }}
                          src={(p as { videoSrc: string }).videoSrc}
                          playsInline
                          loop
                          onClick={() => {
                            const vid = videoRefs.current[p.id];
                            if (vid && playing === p.id) { vid.pause(); setPlaying(null); }
                          }}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1, cursor: playing === p.id ? 'pointer' : undefined }}
                        />
                        {/* Thumbnail overlay — hides once the video has started */}
                        {'thumbnail' in p && playing !== p.id && !started.has(p.id) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={(p as { thumbnail: string }).thumbnail}
                            alt=""
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'thumbPosition' in p ? (p as { thumbPosition: string }).thumbPosition : 'center', display: 'block', zIndex: 2 }}
                          />
                        )}
                        {/* Play overlay — hides once playing */}
                        {playing !== p.id && (
                          <button
                            onClick={() => {
                              if (playing !== null && playing !== p.id) {
                                videoRefs.current[playing]?.pause();
                              }
                              const vid = videoRefs.current[p.id];
                              if (vid) {
                                vid.play();
                                setPlaying(p.id);
                                setStarted(prev => new Set(prev).add(p.id));
                              }
                            }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
                            onMouseEnter={e => { const btn = e.currentTarget.querySelector('.ig-play') as HTMLElement; if (btn) btn.style.transform = 'scale(1.1)'; }}
                            onMouseLeave={e => { const btn = e.currentTarget.querySelector('.ig-play') as HTMLElement; if (btn) btn.style.transform = 'scale(1)'; }}
                          >
                            <div className="ig-play" style={{
                              width: '64px', height: '64px',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.15)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(255,255,255,0.25)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'transform 0.2s ease',
                            }}>
                              <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '18px solid #fff', marginLeft: '4px' }} />
                            </div>
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.img}
                          alt={`${p.client} — ${p.title}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: `linear-gradient(135deg, #${['111', '0a0a14', '0d0d0d', '0a1010', '0d0a0a', '101010'][i % 6]} 0%, #1a1a1a 100%)`,
                          zIndex: 0,
                        }} />
                      </>
                    )}

                    {/* Info overlay */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '24px 20px 20px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                      zIndex: 2,
                      pointerEvents: 'none',
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
            </Reveal>
          </div>

          <style>{`
            @media (max-width: 900px) {
              /* min-height: 0 kills the wide card's 420px desktop floor, which
                 otherwise overrides the 16/9 ratio and crops the thumbnail.
                 Scoped to #work so the shared .project-card class does not
                 override the AI section's 9:16 cards. */
              #work .project-card { grid-column: span 12 !important; aspect-ratio: 16/9 !important; min-height: 0 !important; }
            }
            @media (max-width: 700px) {
              .work-shell { padding: 48px 20px !important; }
            }
            @media (max-width: 600px) {
              #work .project-card { grid-column: span 12 !important; aspect-ratio: 4/3 !important; }
            }
          `}</style>
        </div>
      </section>
    </>
  );
}
