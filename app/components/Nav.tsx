'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'AI', href: '#ai' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 32px',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.08em', color: '#fff', textTransform: 'uppercase' }}>
            Illusia
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }} className="hidden-mobile">
          {links.map(l => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="nav-link"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 400, letterSpacing: '0.04em', cursor: 'pointer', padding: 0 }}
            >
              {l.label}
            </button>
          ))}
          <a
            href="mailto:parker@illusiaagency.com"
            style={{ background: '#fff', color: '#000', borderRadius: '4px', padding: '9px 20px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', textTransform: 'uppercase' }}
          >
            Contact
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'none', padding: '4px' }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          <div style={{ width: '22px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ display: 'block', height: '1px', background: '#fff', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ display: 'block', height: '1px', background: '#fff', transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', height: '1px', background: '#fff', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </div>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(0,0,0,0.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '40px',
        }}>
          {links.map(l => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '32px', fontWeight: 500, letterSpacing: '-0.02em', cursor: 'pointer' }}
            >
              {l.label}
            </button>
          ))}
          <a
            href="mailto:parker@illusiaagency.com"
            style={{ marginTop: '20px', background: '#fff', color: '#000', borderRadius: '4px', padding: '12px 32px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', textTransform: 'uppercase' }}
          >
            Contact Us
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
