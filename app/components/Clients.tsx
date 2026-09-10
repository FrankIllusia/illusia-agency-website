'use client';

import { Reveal } from './fx';

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
  { name: 'Disney',                  src: '/images/clients/disney.svg',     ml: -48 },
  { name: 'Polymarket',              src: '/images/clients/polymarket.png'  },
  { name: 'Life Time',               src: '/images/clients/lifetime.png'    },
  { name: 'Hulu',                    src: '/images/clients/hulu.png',       h: 44 },
  { name: 'ROVE',                    src: '/images/clients/rove.png',        h: 20 },
  { name: 'Searchlight Pictures',    src: '/images/clients/searchlight.png' },
  { name: 'Experiential Supply Co.', src: '/images/clients/esc.png',        h: 38 },
  { name: 'EDM.com',                 src: '/images/clients/edm.png',        h: 38 },
  { name: 'WWE',                     src: '/images/clients/wwe.png',        h: 32 },
  { name: 'Topps',                   src: '/images/clients/topps.png',      h: 40 },
  { name: 'Ford',                    src: '/images/clients/ford.png',       h: 46 },
];

// Duplicate for seamless infinite scroll
const track = [...clients, ...clients];

export default function Clients() {
  return (
    <section style={{ background: '#000', padding: '56px 0', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <Reveal y={18} duration={0.7}>
        <p className="section-label" style={{ textAlign: 'center', marginBottom: '40px', color: 'rgba(255,255,255,0.25)' }}>
          Trusted By
        </p>
      </Reveal>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Fade edges */}
        <div className="client-fade" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2,
          background: 'linear-gradient(to right, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div className="client-fade" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 2,
          background: 'linear-gradient(to left, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Scrolling track */}
        <div className="client-track" style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}>
          {track.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              className={`client-logo${c.ml ? ' client-logo--tight' : ''}`}
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

        /* Spacing lives on each logo as margin-right (not flex gap) so the
           duplicated track tiles perfectly: translateX(-50%) lands exactly on
           one full set, giving a seamless loop with no seam jump. */
        .client-fade  { width: 120px; }
        .client-logo  { margin-right: 96px; }
        .client-track { animation: marquee 32s linear infinite; }

        /* Disney's mark carries a lot of internal whitespace, so it's pulled
           back toward its neighbour. The pull has to stay smaller than the gap
           it's eating into, or the logos collide. */
        .client-logo--tight { margin-left: -48px; }

        /* On a phone the 120px fades ate ~240px of a ~390px viewport and the
           96px gaps did the rest, so a gap could fill the whole visible strip
           and the row read as empty. Shrink both so logos are always on screen. */
        @media (max-width: 700px) {
          .client-fade  { width: 56px; }

          /* Speed and repeat interval are the same number here: one set is only
             ~7 phone-screens wide, so at 40px gaps a logo came back every 18s
             and the strip read as constantly restarting. Widening the gap makes
             the set longer, which buys a slower repeat at a quicker pace -
             120px/s returning every 26s, against 84px/s every 32s originally.
             Still well short of the 96px gaps that used to leave the row
             looking empty on a phone. */
          .client-logo  { margin-right: 64px; }
          .client-track { animation-duration: 26s; }

          /* The pull has to stay smaller than the gap it eats into: at -48px
             against the old 40px gap, Disney sat 8px *under* Lionsgate. */
          .client-logo--tight { margin-left: -20px; }
        }
      `}</style>
    </section>
  );
}
