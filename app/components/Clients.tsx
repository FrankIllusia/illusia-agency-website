'use client';

const LOGO_HEIGHT = 30;

const clients = [
  { name: 'AIRO',                    src: '/images/clients/airo.svg'        },
  { name: '50 Cent',                 src: '/images/clients/50cent.png',     h: 52 },
  { name: 'BLADE',                   src: '/images/clients/blade.png',       h: 18 },
  { name: 'Prada',                   src: '/images/clients/prada.png',       h: 18 },
  { name: 'Tyson 2.0',               src: '/images/clients/tyson.svg',       h: 20 },
  { name: 'Netflix',                 src: '/images/clients/netflix.svg'     },
  { name: 'Joby Aviation',           src: '/images/clients/joby.png'        },
  { name: 'Lionsgate',               src: '/images/clients/lionsgate.svg'   },
  { name: 'Disney',                  src: '/images/clients/disney.svg'      },
  { name: 'Polymarket',              src: '/images/clients/polymarket.png'  },
  { name: 'Life Time',               src: '/images/clients/lifetime.png'    },
  { name: 'Hulu',                    src: '/images/clients/hulu.png',       h: 44 },
  { name: 'ROVE',                    src: '/images/clients/rove.png',        h: 20 },
  { name: 'Searchlight Pictures',    src: '/images/clients/searchlight.png' },
  { name: 'Experiential Supply Co.', src: '/images/clients/esc.png',        h: 38 },
  { name: 'EDM.com',                 src: '/images/clients/edm.png',        h: 38 },
];

// Duplicate for seamless infinite scroll
const track = [...clients, ...clients];

export default function Clients() {
  return (
    <section style={{ background: '#000', padding: '56px 0', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <p className="section-label" style={{ textAlign: 'center', marginBottom: '40px', color: 'rgba(255,255,255,0.25)' }}>
        Trusted By
      </p>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Fade edges */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
          background: 'linear-gradient(to right, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
          background: 'linear-gradient(to left, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Scrolling track */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '96px',
          width: 'max-content',
          animation: 'marquee 32s linear infinite',
        }}>
          {track.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={c.src}
              alt={c.name}
              style={{
                height: `${c.h ?? LOGO_HEIGHT}px`,
                width: 'auto',
                filter: 'brightness(0) invert(1)',
                opacity: 0.65,
                flexShrink: 0,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.opacity = '1')}
              onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.opacity = '0.65')}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
