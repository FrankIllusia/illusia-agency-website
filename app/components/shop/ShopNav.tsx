'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

/* ── Shop nav ─────────────────────────────────────────────────────────────────
   Deliberately not the agency's floating pill. The storefront reads as its own
   property — flush to the top, full bleed, thin rules, everything uppercase —
   while still sitting on illusiaagency.com so navigation stays client-side.

   The one thread back to the agency is the "Agency" link on the right.
──────────────────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { label: 'All',      href: '/shop'            },
  { label: 'New',      href: '/shop?c=new'      },
  { label: 'Apparel',  href: '/shop?c=apparel'  },
  { label: 'Headwear', href: '/shop?c=headwear' },
];

const TICKER = [
  'Free shipping on orders over $150',
  'Only the ascended',
  'Printed & shipped worldwide',
  'Illusia Agency™',
];

export default function ShopNav() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A route change unmounts the page but not the nav, so the mobile sheet has
  // to be closed by hand or it hangs open over the new page.
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="shop-nav-root" data-scrolled={scrolled || undefined}>
        {/* Announcement ticker */}
        <div className="shop-ticker">
          <div className="shop-ticker-track">
            {/* Duplicated so the loop has a seamless second half to scroll into. */}
            {[0, 1].map((copy) => (
              <div className="shop-ticker-run" key={copy} aria-hidden={copy === 1}>
                {TICKER.map((t) => (
                  <span key={t}>
                    {t}
                    <i>✦</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <nav className="shop-nav">
          <button
            className="shop-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle shop menu"
            aria-expanded={menuOpen}
          >
            <span data-open={menuOpen || undefined} />
            <span data-open={menuOpen || undefined} />
          </button>

          <div className="shop-nav-links">
            {CATEGORIES.map((c) => (
              <Link key={c.href} href={c.href} className="shop-nav-link">
                {c.label}
              </Link>
            ))}
          </div>

          <Link href="/shop" className="shop-wordmark" onClick={closeMenu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/illusia-logo.png" alt="Illusia" />
            <em>Shop</em>
          </Link>

          <div className="shop-nav-right">
            <Link href="/" className="shop-nav-link shop-nav-agency">
              Agency <span>↗</span>
            </Link>
            <button className="shop-bag" onClick={open} aria-label="Open bag">
              Bag<span>({count})</span>
            </button>
          </div>
        </nav>

        {/* Mobile sheet */}
        <div className="shop-sheet" data-open={menuOpen || undefined}>
          {CATEGORIES.map((c) => (
            <Link key={c.href} href={c.href} onClick={closeMenu}>
              {c.label}
            </Link>
          ))}
          <Link href="/" onClick={closeMenu} className="shop-sheet-agency">
            Back to Agency ↗
          </Link>
        </div>
      </header>

      <style>{`
        .shop-nav-root {
          position: sticky;
          top: 0;
          z-index: 80;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .shop-nav-root[data-scrolled] {
          background: rgba(0,0,0,0.93);
          border-bottom-color: rgba(255,255,255,0.12);
        }

        /* ── Ticker ── */
        .shop-ticker {
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          height: 30px;
          display: flex;
          align-items: center;
        }
        .shop-ticker-track {
          display: flex;
          width: max-content;
          animation: shop-ticker 34s linear infinite;
        }
        .shop-ticker-run {
          display: flex;
          align-items: center;
        }
        .shop-ticker-run span {
          display: inline-flex;
          align-items: center;
          font-size: 9.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          white-space: nowrap;
        }
        .shop-ticker-run i {
          font-style: normal;
          margin: 0 26px;
          color: rgba(255,255,255,0.22);
          font-size: 8px;
        }
        @keyframes shop-ticker {
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .shop-ticker-track { animation: none; }
        }

        /* ── Nav row ── */
        .shop-nav {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 62px;
          padding: 0 22px;
        }
        .shop-nav-links {
          display: flex;
          gap: 26px;
          flex: 1;
        }
        .shop-nav-link {
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .shop-nav-link:hover { color: #fff; }

        .shop-wordmark {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }
        .shop-wordmark img { height: 22px; width: auto; }
        .shop-wordmark em {
          font-style: normal;
          font-size: 9.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          border-left: 1px solid rgba(255,255,255,0.18);
          padding-left: 9px;
        }

        .shop-nav-right {
          display: flex;
          align-items: center;
          gap: 22px;
          flex: 1;
          justify-content: flex-end;
        }
        .shop-nav-agency span { font-size: 12px; }

        .shop-bag {
          background: none;
          border: none;
          cursor: pointer;
          color: #fff;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: inherit;
          display: flex;
          gap: 6px;
          padding: 0;
        }
        .shop-bag span { color: rgba(255,255,255,0.5); }
        .shop-bag:hover span { color: #fff; }

        /* ── Mobile ── */
        .shop-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 8px 8px 0;
        }
        .shop-burger span {
          display: block;
          width: 19px;
          height: 1.5px;
          background: #fff;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .shop-burger span[data-open]:first-child { transform: rotate(45deg) translateY(4.6px); }
        .shop-burger span[data-open]:last-child  { transform: rotate(-45deg) translateY(-4.6px); }

        .shop-sheet {
          display: none;
          flex-direction: column;
          gap: 2px;
          padding: 0 22px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.32s ease, padding 0.32s ease;
          border-top: 1px solid transparent;
        }
        .shop-sheet[data-open] {
          max-height: 320px;
          padding: 14px 22px 22px;
          border-top-color: rgba(255,255,255,0.08);
        }
        .shop-sheet a {
          color: #fff;
          text-decoration: none;
          font-size: 22px;
          letter-spacing: -0.01em;
          padding: 7px 0;
        }
        .shop-sheet-agency {
          margin-top: 10px;
          font-size: 11px !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55) !important;
        }

        @media (max-width: 860px) {
          .shop-nav-links { display: none; }
          .shop-burger    { display: flex; }
          .shop-sheet     { display: flex; }
          .shop-nav-agency { display: none; }
          .shop-wordmark em { display: none; }
          .shop-nav { padding: 0 16px; height: 56px; }
        }
      `}</style>
    </>
  );
}
