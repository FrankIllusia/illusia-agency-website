'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import { Reveal, RiseIn, ScrubText } from '../fx';
import {
  DriftImage,
  HeroScroll,
  Magnetic,
  PinnedRail,
  SplitTakeover,
  WipeText,
} from './ShopMotion';
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
  takeover: string;
  /** Background-removed figures for the takeover section's edges. */
  cutoutLeft: string;
  cutoutRight: string;
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
          <HeroScroll className="shop-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art.hero} alt="Illusia Agency collection" data-hero-media />
            <div className="shop-hero-scrim" />
            <div className="shop-hero-copy" data-hero-copy>
              <p className="section-label">Collection 001</p>
              <RiseIn stagger={0.1}>
                <h1>
                  Only The
                  <br />
                  Ascended
                </h1>
              </RiseIn>
              <Reveal delay={0.35} y={24} start="top bottom" className="shop-hero-ctas">
                <Magnetic>
                  <Link href="#all" className="btn-solid">
                    Shop the Collection
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/shop?c=new" className="btn-ghost">
                    New Arrivals
                  </Link>
                </Magnetic>
              </Reveal>
            </div>
          </HeroScroll>

          {/* ── Latest rail ── */}
          {featured.length > 0 && products.length > featured.length && (
            <PinnedRail
              className="shop-section shop-latest"
              trackClassName="shop-rail"
              head={
                <div className="shop-section-head">
                  <p className="section-label">Latest</p>
                  <Link href="/shop?c=new" className="shop-seeall">
                    See all ↗
                  </Link>
                </div>
              }
            >
              {featured.map((p) => (
                <Reveal key={p.id} y={48} className="shop-rail-item">
                  <ProductCard product={p} priority />
                </Reveal>
              ))}
            </PinnedRail>
          )}

          {/* ── Headwear / Apparel takeover (landonorris.com "On / Off track") ── */}
          <SplitTakeover
            left={
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={art.cutoutLeft} alt="James in the Pegasus hoodie" />
            }
            right={
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={art.cutoutRight} alt="Tony in the LA FLAME cap" />
            }
            center={
              <div className="lx-cols">
                <div className="lx-col lx-col-l">
                  <WipeText>
                    <h2>
                      <span className="lx-light">Street</span>
                      <span className="lx-heavy">Wear</span>
                    </h2>
                  </WipeText>
                  <p>Washed tees, long sleeves and warm-ups for long shoot days.</p>
                  <Magnetic>
                    <Link href="/shop?c=apparel" className="lx-go" aria-label="Shop apparel">
                      ↙
                    </Link>
                  </Magnetic>
                </div>
                <div className="lx-col lx-col-r">
                  <WipeText delay={0.15}>
                    <h2>
                      <span className="lx-light">Head</span>
                      <span className="lx-heavy">Wear</span>
                    </h2>
                  </WipeText>
                  <p>Five-panel caps and truckers, embroidered to order.</p>
                  <Magnetic>
                    <Link href="/shop?c=headwear" className="lx-go" aria-label="Shop headwear">
                      ↘
                    </Link>
                  </Magnetic>
                </div>
              </div>
            }
            takeover={
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.takeover} alt="Illusia Global Cap, close up" />
                <div className="lx-take-copy">
                  <p className="section-label">Embroidered In-House</p>
                  <Link href="/shop/illusia-global-cap" className="btn-solid">
                    Shop the Global Cap
                  </Link>
                </div>
              </>
            }
          />
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
          <>
            <p className="shop-empty">
              {copy?.title ?? 'This drop'} is coming soon. In the meantime, here is
              everything that is live now.
            </p>
            <Reveal stagger={0.06} className="shop-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 3} />
              ))}
            </Reveal>
          </>
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
          <DriftImage amount={10}>
            <img src={art.banner} alt="Pegasus hoodie back print" />
          </DriftImage>
          <div className="shop-banner-copy">
            <p className="section-label">Lookbook</p>
            <RiseIn>
              <h2>Built For The Work</h2>
            </RiseIn>
            <ScrubText className="shop-banner-body">
              <p>
                Made for long shoot days and longer edits. Printed and shipped on
                demand — nothing sits in a warehouse.
              </p>
            </ScrubText>
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
          /* Pushed right of centre so the subject clears the headline, which
             is bottom-left. */
          object-position: 68% 20%;
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
        .shop-rail { position: relative; }

        /* Pinned (desktop, overflowing): the section fills the viewport while
           scroll drives the cards sideways — see PinnedRail. */
        .shop-latest.is-pinned {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .shop-latest.is-pinned .shop-rail {
          overflow: hidden;
          grid-auto-columns: clamp(280px, 27vw, 420px);
        }
        .rail-bar {
          display: none;
          margin-top: 28px;
          height: 1px;
          background: rgba(255,255,255,0.12);
          overflow: hidden;
        }
        .shop-latest.is-pinned .rail-bar { display: block; }
        .rail-bar i {
          display: block;
          height: 100%;
          background: #fff;
          transform: scaleX(0);
          transform-origin: left;
        }

        /* Oversized layer the photography drifts inside — see DriftImage. */
        .drift {
          position: absolute;
          inset: -8% 0;
        }

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

        /* ── Headwear / Apparel takeover ── */
        .lx { position: relative; }
        .lx-stage {
          position: relative;
          display: grid;
          gap: 2px;
        }
        .lx-take img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* Cut-out figures sit straight on the page background, bottom-anchored,
           like the helmet and portrait on landonorris.com. */
        .lx-side img {
          display: block;
          height: 100%;
          width: auto;
          max-width: none;
        }
        .lx-side {
          height: min(72vh, 560px);
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }
        .lx-left { justify-content: flex-start; }
        .lx-right { justify-content: flex-end; }
        /* The shoot frames crop the torsos with a straight edge; dissolve the
           inner edge (and the bottom) into the page so the figure reads as a
           cut-out rather than a photo with its corner showing. */
        .lx-left img {
          -webkit-mask-image: linear-gradient(to left, transparent 0%, #000 22%), linear-gradient(to top, transparent 0%, #000 14%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to left, transparent 0%, #000 22%), linear-gradient(to top, transparent 0%, #000 14%);
          mask-composite: intersect;
        }
        .lx-right img {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 22%), linear-gradient(to top, transparent 0%, #000 14%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to right, transparent 0%, #000 22%), linear-gradient(to top, transparent 0%, #000 14%);
          mask-composite: intersect;
        }
        .lx-center { padding: 56px 16px; }
        .lx-take { position: relative; height: min(70vh, 560px); overflow: hidden; }

        .lx-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
        }
        .lx-col h2 {
          display: flex;
          flex-direction: column;
          line-height: 0.88;
          text-transform: uppercase;
          letter-spacing: -0.035em;
        }
        .lx-light {
          font-size: clamp(40px, 5.4vw, 92px);
          font-weight: 300;
          white-space: nowrap;
        }
        .lx-heavy {
          font-size: clamp(46px, 6.6vw, 112px);
          font-weight: 800;
          white-space: nowrap;
        }
        .lx-col p {
          margin-top: 22px;
          max-width: 30ch;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          line-height: 1.55;
        }
        .lx-col-l { text-align: right; }
        .lx-col-l h2 { align-items: flex-end; }
        .lx-col-l p { margin-left: auto; }
        .lx-go {
          margin-top: 22px;
          display: inline-grid;
          place-items: center;
          width: 58px;
          height: 58px;
          background: #fff;
          color: #000;
          font-size: 20px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .lx-go:hover { background: rgba(255,255,255,0.82); }

        .lx-take-copy {
          position: absolute;
          left: 32px;
          bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .lx-take::after {
          content: '';
          position: absolute;
          inset: 0;
          /* Bottom runs to solid black so, as the stage scrolls away, the photo's
             lower edge melts into the page instead of showing a hard line. */
          background: linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 50%);
          pointer-events: none;
        }
        .lx-take-copy { z-index: 1; }

        /* Desktop: sticky stage, driven by SplitTakeover's scrubbed timeline. */
        .lx.is-staged { height: 320vh; }
        .lx.is-staged .lx-stage {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: block;
        }
        /* Each figure bleeds off its edge: the left one's right edge sits at
           27vw, the right one's left edge at 73vw, so only the inner ~two thirds
           of each (face and cap) is on screen. */
        .lx.is-staged .lx-side {
          position: absolute;
          bottom: 0;
          height: 90vh;
          overflow: visible;
        }
        .lx.is-staged .lx-left { right: 73vw; }
        .lx.is-staged .lx-right { left: 73vw; }
        .lx.is-staged .lx-center {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 0 28vw;
        }
        .lx.is-staged .lx-take {
          position: absolute;
          inset: 0;
          height: auto;
          z-index: 2;
          clip-path: inset(100% 0% 0% 0%);
        }

        /* WipeText */
        .wipe-line { position: relative; }
        .wipe-block {
          position: absolute;
          inset: 4% -2%;
          background: currentColor;
          transform: scaleX(0);
          pointer-events: none;
        }

        /* ── Banner ── */
        .shop-banner {
          position: relative;
          min-height: min(88vh, 820px);
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
        .shop-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.78) 0%,
            rgba(0,0,0,0.35) 45%,
            rgba(0,0,0,0) 75%
          );
          pointer-events: none;
        }
        .shop-banner-copy {
          position: relative;
          z-index: 1;
          padding: 120px 32px 60px;
          max-width: 620px;
        }
        .shop-banner-copy h2 {
          margin-top: 12px;
          font-size: clamp(32px, 5vw, 66px);
          text-transform: uppercase;
          letter-spacing: -0.03em;
        }
        .shop-banner-body p {
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
          .lx-cols { grid-template-columns: 1fr; gap: 44px; }
          .lx-col-l { text-align: left; }
          .lx-col-l h2 { align-items: flex-start; }
          .lx-col-l p { margin-left: 0; }
          .shop-banner-copy { padding: 100px 16px 44px; }
        }
      `}</style>
    </>
  );
}
