'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const links = [
  { label: 'Work',     href: '#work'     },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about'    },
  { label: 'Team',     href: '#team'     },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    // If already loaded this session, show nav immediately
    if (sessionStorage.getItem('illusiaLoaded')) {
      setNavReady(true);
      return;
    }
    const onLoaded = () => setNavReady(true);
    window.addEventListener('illusiaLoaded', onLoaded);
    return () => window.removeEventListener('illusiaLoaded', onLoaded);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating pill nav */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 48px)',
        maxWidth: '1360px',
        opacity: navReady ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '100px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '0 20px 0 24px',
          height: '56px',
        }}>

          {/* Left — hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', display: 'flex', flexDirection: 'column',
              gap: '5px', flexShrink: 0,
            }}
          >
            <span style={{
              display: 'block', width: '20px', height: '1.5px', background: '#fff',
              transition: 'transform 0.25s',
              transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '1.5px', background: '#fff',
              transition: 'opacity 0.25s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '20px', height: '1.5px', background: '#fff',
              transition: 'transform 0.25s',
              transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none',
            }} />
          </button>

          {/* Center — logo */}
          <Link
            href="/"
            style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              textDecoration: 'none', display: 'flex', alignItems: 'center',
              opacity: navReady ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/illusia-logo.png"
              alt="Illusia"
              style={{ height: '28px', width: 'auto' }}
            />
          </Link>

          {/* Right — CTA pill */}
          <a
            href="mailto:parker@illusiaagency.com?subject=We%27re%20Interested%20In%20Working%20Together!"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#fff',
              color: '#000',
              borderRadius: '100px',
              padding: '8px 18px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.07em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.88)')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#fff')}
          >
            Work With Us
            <span style={{ fontSize: '13px' }}>↗</span>
          </a>

        </nav>
      </div>

      {/* Full-screen menu overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: 'rgba(0,0,0,0.97)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '12px',
        pointerEvents: menuOpen ? 'all' : 'none',
        opacity: menuOpen ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        {links.map(l => (
          <button
            key={l.href}
            onClick={() => scrollTo(l.href)}
            style={{
              background: 'none', border: 'none',
              color: '#fff',
              fontSize: 'clamp(36px, 7vw, 72px)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.4')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            {l.label}
          </button>
        ))}
        <a
          href="mailto:parker@illusiaagency.com?subject=We%27re%20Interested%20In%20Working%20Together!"
          style={{
            marginTop: '32px',
            background: '#fff', color: '#000',
            borderRadius: '100px',
            padding: '14px 36px',
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.08em',
            textDecoration: 'none', textTransform: 'uppercase',
          }}
        >
          Work With Us ↗
        </a>
      </div>
    </>
  );
}
