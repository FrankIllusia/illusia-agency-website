'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useCart } from './CartProvider';
import { formatMoney, imageUrl } from '@/lib/shop/format';
import type { Product } from '@/lib/shop/types';

/* ── Product detail ───────────────────────────────────────────────────────────
   Scrolling gallery on the left, sticky buy column on the right. Colour is
   fixed per product here because each Tapstitch colourway syncs into Shopify
   as its own product rather than as a variant axis — so the only real choice
   on this page is size.
──────────────────────────────────────────────────────────────────────────── */

const ACCORDIONS = [
  {
    title: 'Details',
    body: 'Printed and embroidered to order by our production partner, then shipped direct. Because nothing is made in advance, expect 2–5 business days in production before dispatch.',
  },
  {
    title: 'Sizing',
    body: 'Fits true to size with a relaxed body. If you are between sizes or want a boxier drape, size up. Measurements are taken flat and may vary slightly between runs.',
  },
  {
    title: 'Shipping & Returns',
    body: 'Free shipping on orders over $150. Unworn items can be returned within 14 days of delivery. Made-to-order pieces are exchanged for sizing issues rather than refunded.',
  },
];

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { add, open } = useCart();

  // Synced variants arrive in creation order (Tapstitch gives "M, L, XL, 2XL, S").
  const sizes = [...(product.options.find((o) => o.name === 'Size')?.values ?? [])].sort(
    (a, b) => sizeRank(a) - sizeRank(b)
  );
  const isOneSize = sizes.length <= 1;

  const firstAvailable = useMemo(
    () => product.variants.find((v) => v.availableForSale),
    [product.variants]
  );

  // One-size products have nothing to choose, so they start selected and the
  // button is live immediately.
  const [selectedSize, setSelectedSize] = useState<string | null>(
    isOneSize ? (firstAvailable?.selectedOptions.Size ?? null) : null
  );
  const [openPanel, setOpenPanel] = useState<string | null>('Details');
  const [error, setError] = useState<string | null>(null);

  // Printful/Tapstitch one-size items carry no Size option at all — a single
  // "Default Title" variant — so matching on Size would never find it.
  const selectedVariant = useMemo(
    () =>
      isOneSize
        ? firstAvailable ?? product.variants[0] ?? null
        : product.variants.find((v) => v.selectedOptions.Size === selectedSize) ??
          null,
    [isOneSize, firstAvailable, product.variants, selectedSize]
  );

  const desc = useMemo(() => splitDescription(product), [product]);

  const soldOut = !product.availableForSale;
  const colorway = product.options.find((o) => o.name === 'Color')?.values.join(' / ');

  const addToBag = () => {
    if (!selectedVariant) {
      setError('Select a size first.');
      return;
    }
    if (!selectedVariant.availableForSale) {
      setError('That size is sold out.');
      return;
    }
    setError(null);
    add(selectedVariant.id);
  };

  const price = selectedVariant?.price ?? product.priceRange.min;
  const compareAt = selectedVariant?.compareAtPrice ?? null;

  return (
    <>
      <div className="pdp">
        <nav className="pdp-crumbs">
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <em>{product.title}</em>
        </nav>

        <div className="pdp-body">
          {/* ── Gallery ── */}
          <div className="pdp-gallery">
            {product.images.map((image, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`${image.url}-${i}`}
                src={imageUrl(image.url, 1400)}
                alt={image.altText}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          {/* ── Buy column ── */}
          <div className="pdp-buy">
            <div className="pdp-buy-inner">
              <h1>{product.title}</h1>

              <p className="pdp-price">
                {compareAt && compareAt.amount > price.amount && (
                  <s>{formatMoney(compareAt)}</s>
                )}
                {formatMoney(price)}
              </p>

              {colorway && <p className="pdp-color">{colorway}</p>}

              <div className="pdp-desc">
                {desc.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {desc.bullets.length > 0 && (
                  <ul>
                    {desc.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>

              {!isOneSize && (
                <div className="pdp-sizes">
                  <div className="pdp-sizes-head">
                    <span>Size</span>
                    {selectedSize && <em>{selectedSize}</em>}
                  </div>
                  <div className="pdp-size-grid">
                    {sizes.map((size) => {
                      const variant = product.variants.find(
                        (v) => v.selectedOptions.Size === size
                      );
                      const available = Boolean(variant?.availableForSale);
                      return (
                        <button
                          key={size}
                          disabled={!available}
                          data-selected={selectedSize === size || undefined}
                          onClick={() => {
                            setSelectedSize(size);
                            setError(null);
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                className="pdp-add"
                onClick={addToBag}
                disabled={soldOut}
              >
                {soldOut ? 'Sold Out' : 'Add to Bag'}
              </button>

              {error && <p className="pdp-error">{error}</p>}

              <button className="pdp-viewbag" onClick={open}>
                View bag ↗
              </button>

              <div className="pdp-accordions">
                {ACCORDIONS.map((base) => {
                  // The apparel fit note is meaningless on a cap.
                  const panel =
                    base.title === 'Sizing' && isOneSize
                      ? { ...base, body: 'One size fits most, with an adjustable snap closure at the back.' }
                      : base;
                  const isOpen = openPanel === panel.title;
                  return (
                    <div key={panel.title} className="pdp-panel">
                      <button
                        onClick={() => setOpenPanel(isOpen ? null : panel.title)}
                        aria-expanded={isOpen}
                      >
                        {panel.title}
                        <i>{isOpen ? '–' : '+'}</i>
                      </button>
                      <div className="pdp-panel-body" data-open={isOpen || undefined}>
                        <p>{panel.body}</p>
                        {panel.title === 'Details' &&
                          desc.sections.map((sec) => (
                            <div key={sec.title} className="pdp-spec">
                              <h4>{sec.title}</h4>
                              <ul>
                                {sec.items.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        {panel.title === 'Sizing' && desc.sizeChart && (
                          <table className="pdp-chart">
                            <thead>
                              <tr>
                                <th>Inches</th>
                                {desc.sizeChart.sizes.map((sz) => (
                                  <th key={sz}>{sz}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {desc.sizeChart.rows.map((row) => (
                                <tr key={row.label}>
                                  <td>{row.label}</td>
                                  {row.values.map((v, i) => (
                                    <td key={i}>{v}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="pdp-related">
            <p className="section-label">You may also like</p>
            <div className="pdp-related-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .pdp-crumbs {
          display: flex;
          gap: 8px;
          padding: 26px 32px 0;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .pdp-crumbs a { color: rgba(255,255,255,0.6); text-decoration: none; }
        .pdp-crumbs a:hover { color: #fff; }
        .pdp-crumbs em { font-style: normal; color: rgba(255,255,255,0.4); }

        .pdp-body {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 42px;
          padding: 22px 32px 80px;
          align-items: start;
        }

        .pdp-gallery {
          display: grid;
          gap: 8px;
        }
        .pdp-gallery img {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          background: #101010;
        }

        .pdp-buy {
          position: sticky;
          /* Clears the sticky shop nav (30px ticker + 62px bar) plus breathing room. */
          top: 118px;
        }
        .pdp-buy-inner { max-width: 430px; }
        .pdp-buy h1 {
          font-size: clamp(26px, 3vw, 40px);
          text-transform: uppercase;
          letter-spacing: -0.025em;
        }
        .pdp-price {
          margin-top: 14px;
          font-size: 16px;
          display: flex;
          gap: 10px;
        }
        .pdp-price s { color: rgba(255,255,255,0.35); }
        .pdp-color {
          margin-top: 6px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .pdp-desc {
          margin-top: 22px;
          font-size: 13.5px;
          line-height: 1.65;
          color: rgba(255,255,255,0.62);
        }
        .pdp-desc p + p { margin-top: 10px; }
        .pdp-desc ul {
          margin-top: 14px;
          padding-left: 0;
          list-style: none;
        }
        .pdp-desc li {
          position: relative;
          padding-left: 16px;
        }
        .pdp-desc li + li { margin-top: 4px; }
        .pdp-desc li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.78em;
          width: 6px;
          height: 1px;
          background: rgba(255,255,255,0.45);
        }

        .pdp-spec { margin-top: 16px; }
        .pdp-spec h4 {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
        }
        .pdp-spec ul { margin-top: 8px; padding: 0; list-style: none; }
        .pdp-spec li {
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(255,255,255,0.55);
        }
        .pdp-chart {
          margin-top: 14px;
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          font-variant-numeric: tabular-nums;
        }
        .pdp-chart th, .pdp-chart td {
          padding: 8px 6px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-align: center;
        }
        .pdp-chart th {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
        }
        .pdp-chart th:first-child, .pdp-chart td:first-child { text-align: left; }

        .pdp-sizes { margin-top: 30px; }
        .pdp-sizes-head {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 10px;
        }
        .pdp-sizes-head em { font-style: normal; color: #fff; }
        .pdp-size-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 6px;
        }
        .pdp-size-grid button {
          padding: 13px 0;
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-family: inherit;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
        }
        .pdp-size-grid button:hover:not(:disabled) { border-color: #fff; }
        .pdp-size-grid button[data-selected] {
          background: #fff;
          color: #000;
          border-color: #fff;
        }
        .pdp-size-grid button:disabled {
          opacity: 0.28;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        .pdp-add {
          margin-top: 22px;
          width: 100%;
          padding: 17px;
          background: #fff;
          color: #000;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: opacity 0.2s ease;
        }
        .pdp-add:hover:not(:disabled) { opacity: 0.86; }
        .pdp-add:disabled { opacity: 0.35; cursor: not-allowed; }

        .pdp-error {
          margin-top: 10px;
          font-size: 11px;
          color: #ffb4b4;
          letter-spacing: 0.04em;
        }

        .pdp-viewbag {
          margin-top: 12px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.5);
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 6px;
        }
        .pdp-viewbag:hover { color: #fff; }

        .pdp-accordions {
          margin-top: 34px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .pdp-panel { border-bottom: 1px solid rgba(255,255,255,0.1); }
        .pdp-panel > button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          color: #fff;
          font-family: inherit;
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 17px 0;
        }
        .pdp-panel > button i {
          font-style: normal;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }
        .pdp-panel-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.34s ease;
        }
        .pdp-panel-body[data-open] { max-height: 1200px; padding-bottom: 18px; }
        .pdp-panel-body p {
          padding-bottom: 18px;
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(255,255,255,0.55);
        }

        .pdp-related {
          padding: 0 32px 90px;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 54px;
        }
        .pdp-related-grid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        @media (max-width: 980px) {
          .pdp-body {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .pdp-buy { position: static; }
          .pdp-buy-inner { max-width: none; }
          .pdp-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .pdp-crumbs { padding: 20px 16px 0; }
          .pdp-body { padding: 18px 16px 60px; }
          .pdp-related { padding: 40px 16px 70px; }
        }
      `}</style>
    </>
  );
}

/* ── Synced descriptions ──────────────────────────────────────────────────────
   Printful writes prose followed by "•" lines split with <br>. Tapstitch writes
   an intro <p>, then <h3>Features / Care Instructions / Fabric</h3> sections of
   "- " paragraphs, then an inline-styled <table id="size-guide">. Both are
   rebuilt as plain text rather than injecting their HTML, so nothing from a
   third-party sync reaches the page as markup.
──────────────────────────────────────────────────────────────────────────── */
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', '5XL'];
function sizeRank(size: string): number {
  const i = SIZE_ORDER.indexOf(size.toUpperCase());
  return i === -1 ? SIZE_ORDER.length : i;
}

type SizeChart = { sizes: string[]; rows: { label: string; values: string[] }[] };
type Description = {
  paragraphs: string[];
  bullets: string[];
  sections: { title: string; items: string[] }[];
  sizeChart: SizeChart | null;
};

const BULLET = /^[•\-–*]\s*/;

function text(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function lines(html: string): string[] {
  return html.split(/<br\s*\/?>|<\/p>|<\/li>|\n/i).map(text).filter(Boolean);
}

/* Tapstitch's table: row 1 is the sizes (colspan 2 each), row 2 the
   inch/cm unit labels, then one row per measurement as label + inch,cm pairs.
   Only inches are kept — the shop prices in USD. */
function parseSizeChart(table: string): SizeChart | null {
  const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((m) =>
    [...m[0].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => text(c[1]))
  );
  if (rows.length < 3) return null;
  const sizes = rows[0].filter(Boolean);
  const body = rows
    .slice(2)
    .map(([label, ...cells]) => ({ label, values: cells.filter((_, i) => i % 2 === 0) }))
    .filter((r) => r.label && r.values.length === sizes.length);
  return sizes.length && body.length ? { sizes, rows: body } : null;
}

function splitDescription(product: Product): Description {
  let html = product.descriptionHtml || product.description;

  let sizeChart: SizeChart | null = null;
  html = html.replace(/<table[\s\S]*?<\/table>/gi, (table) => {
    sizeChart ??= parseSizeChart(table);
    return '';
  });

  // Alternating [intro, heading, body, heading, body, …]
  const parts = html.split(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const intro = lines(parts[0]);
  const sections: Description['sections'] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const items = lines(parts[i + 1] ?? '').map((l) => l.replace(BULLET, ''));
    if (items.length) sections.push({ title: text(parts[i]), items });
  }

  return {
    paragraphs: intro.filter((l) => !BULLET.test(l)),
    bullets: intro.filter((l) => BULLET.test(l)).map((l) => l.replace(BULLET, '')),
    sections,
    sizeChart,
  };
}
