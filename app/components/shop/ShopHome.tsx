'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import { Reveal } from '../fx';
import type { Product } from '@/lib/shop/types';

/* ── Shop home ────────────────────────────────────────────────────────────────
   Represent's homepage rhythm — full-bleed hero, a short "latest" rail, two
   editorial modules, then the full grid — compressed for a small catalogue.
   With eight products a four-up grid reads as thin, so the grid is three-up
   and the editorial blocks carry more of the page.
──────────────────────────────────────────────────────────────────────────── */

export type EditorialArt = {
  hero: string;
  splitLeft: string;
  splitRight: string;
  banner: string;
};

const CATEGORY_COPY: Record<string, { title: string; blurb: string }> = {
  new:      { title: 'New Arrivals', blurb: 'The most recent additions to the collection.' },
  apparel:  { title: 'Apparel',      blurb: 'Hoods, crews, long sleeves and tees.' },
  headwear: { title: 'Headwear',     blurb: 'Truckers and caps, embroidered in-house.' },
};

export default function ShopHome({
  products,
  featured,
  activeCategory,
  art,
}: {
  products: Product[];
  featured: Product[];
  activeCategory: string | null;
  art: EditorialArt;
}) {
  const filtered = activeCategory
    ? products.filter((p) => p.tags.includes(activeCategory))
    : products;

  const copy = activeCategory ? CATEGORY_COPY[activeCategory] : null;

  return (
    <>
      {activeCategory ? (
        <header className="shop-cathead">
          <p className="section-label">Collection</p>
          <h1>{copy?.title ?? activeCategory}</h1>
          {copy?.blurb && <p className="shop-cathead-blurb">{copy.blurb}</p>}
          <Link href="/shop" className="shop-cathead-back">
            View everything ↗
          </Link>
        </header>
      ) : (
        <>
          {/* ── Hero ── */}
          <section className="shop-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art.hero} alt="Illusia Agency collection" />
            <div className="shop-hero-scrim" />
            <div className="shop-hero-copy">
              <p className="section-label">Collection 001</p>
              <h1>
                Only The
                <br />
                Ascended
              </h1>
              <div className="shop-hero-ctas">
                <Link href="#all" className="btn-solid">
                  Shop the Collection
                </Link>
                <Link href="/shop?c=new" className="btn-ghost">
                  New Arrivals
                </Link>
              </div>
            </div>
          </section>

          {/* ── Latest rail ── */}
          {featured.length > 0 && (
            <section className="shop-section">
              <div className="shop-section-head">
                <p className="section-label">Latest</p>
                <Link href="/shop?c=new" className="shop-seeall">
                  See all ↗
                </Link>
              </div>
              <Reveal stagger={0.07} className="shop-rail">
                {featured.map((p) => (
                  <div key={p.id} className="shop-rail-item">
                    <ProductCard product={p} priority />
                  </div>
                ))}
              </Reveal>
            </section>
          )}

          {/* ── Editorial split ── */}
          <section className="shop-split">
            <Link href="/shop?c=apparel" className="shop-split-cell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art.splitLeft} alt="Apparel" />
              <div className="shop-split-copy">
                <h2>Apparel</h2>
                <span>Shop now ↗</span>
              </div>
            </Link>
            <Link href="/shop?c=headwear" className="shop-split-cell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art.splitRight} alt="Headwear" />
              <div className="shop-split-copy">
                <h2>Headwear</h2>
                <span>Shop now ↗</span>
              </div>
            </Link>
          </section>
        </>
      )}

      {/* ── Full grid ── */}
      <section className="shop-section" id="all">
        <div className="shop-section-head">
          <p className="section-label">
            {activeCategory ? `${filtered.length} pieces` : 'All Products'}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="shop-empty">
            Nothing in this collection yet — check back shortly.
          </p>
        ) : (
          <Reveal stagger={0.06} className="shop-grid">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </Reveal>
        )}
      </section>

      {/* ── Editorial banner ── */}
      {!activeCategory && (
        <section className="shop-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art.banner} alt="Illusia Agency lookbook" />
          <div className="shop-banner-copy">
            <p className="section-label">Lookbook</p>
            <h2>Built For The Work</h2>
            <p>
              Made for long shoot days and longer edits. Printed and shipped on
              demand — nothing sits in a warehouse.
            </p>
          </div>
        </section>
      )}

      <style>{`
        /* ── Hero ── */
        .shop-hero {
          position: relative;
          height: min(88vh, 820px);
          overflow: hidden;
        }
        .shop-hero img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 28%;
        }
        .shop-hero-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.85) 0%,
            rgba(0,0,0,0.25) 45%,
            rgba(0,0,0,0.35) 100%
          );
        }
        .shop-hero-copy {
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 0 32px 54px;
          max-width: 760px;
        }
        .shop-hero-copy h1 {
          margin-top: 14px;
          font-size: clamp(46px, 8.5vw, 118px);
          line-height: 0.9;
          letter-spacing: -0.035em;
          text-transform: uppercase;
        }
        .shop-hero-ctas {
          margin-top: 30px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-solid, .btn-ghost {
          display: inline-block;
          padding: 15px 30px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.22s ease, color 0.22s ease;
        }
        .btn-solid { background: #fff; color: #000; }
        .btn-solid:hover { background: rgba(255,255,255,0.85); }
        .btn-ghost {
          border: 1px solid rgba(255,255,255,0.35);
          color: #fff;
        }
        .btn-ghost:hover { background: #fff; color: #000; }

        /* ── Category header ── */
        .shop-cathead {
          padding: 74px 32px 34px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .shop-cathead h1 {
          margin-top: 12px;
          font-size: clamp(36px, 6vw, 76px);
          text-transform: uppercase;
          letter-spacing: -0.03em;
        }
        .shop-cathead-blurb {
          margin-top: 14px;
          color: rgba(255,255,255,0.5);
          font-size: 13.5px;
          max-width: 46ch;
        }
        .shop-cathead-back {
          display: inline-block;
          margin-top: 20px;
          color: rgba(255,255,255,0.7);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.25);
          padding-bottom: 3px;
        }
        .shop-cathead-back:hover { color: #fff; }

        /* ── Sections ── */
        .shop-section { padding: 66px 32px; }
        .shop-section-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 26px;
        }
        .shop-seeall {
          color: rgba(255,255,255,0.55);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .shop-seeall:hover { color: #fff; }

        .shop-rail {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(240px, 1fr);
          gap: 18px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .shop-rail::-webkit-scrollbar { display: none; }

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px 18px;
        }

        .shop-empty {
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          padding: 40px 0 60px;
        }

        /* ── Editorial split ── */
        .shop-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .shop-split-cell {
          position: relative;
          display: block;
          aspect-ratio: 3 / 4;
          max-height: 720px;
          overflow: hidden;
          text-decoration: none;
        }
        .shop-split-cell img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .shop-split-cell:hover img { transform: scale(1.05); }
        .shop-split-copy {
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 30px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0));
          width: 100%;
        }
        .shop-split-copy h2 {
          font-size: clamp(24px, 3.4vw, 44px);
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #fff;
        }
        .shop-split-copy span {
          display: inline-block;
          margin-top: 10px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }

        /* ── Banner ── */
        .shop-banner {
          position: relative;
          min-height: 560px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .shop-banner img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
        }
        .shop-banner-copy {
          position: relative;
          padding: 0 32px 60px;
          max-width: 620px;
          background: linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0));
          padding-top: 120px;
        }
        .shop-banner-copy h2 {
          margin-top: 12px;
          font-size: clamp(32px, 5vw, 66px);
          text-transform: uppercase;
          letter-spacing: -0.03em;
        }
        .shop-banner-copy p:last-child {
          margin-top: 16px;
          color: rgba(255,255,255,0.62);
          font-size: 13.5px;
          line-height: 1.6;
        }

        @media (max-width: 980px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .shop-section { padding: 46px 16px; }
          .shop-hero-copy { padding: 0 16px 38px; }
          .shop-cathead { padding: 54px 16px 26px; }
          .shop-grid { gap: 20px 10px; }
          .shop-split { grid-template-columns: 1fr; }
          .shop-banner-copy { padding: 100px 16px 44px; }
        }
      `}</style>
    </>
  );
}
