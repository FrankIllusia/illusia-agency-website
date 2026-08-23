'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { formatMoney, imageUrl } from '@/lib/shop/format';
import type { Product } from '@/lib/shop/types';

/* ── Product card ─────────────────────────────────────────────────────────────
   Represent's grid behaviour: the second shot cross-fades in on hover and a
   size rail slides up for one-click add, so the common case never needs the
   product page. Products with a single size (headwear) add straight from the
   button instead of showing a pointless "OS" rail.

   Styles live in app/shop/shop.css, not in a <style> block here — this renders
   once per product, so an inline block would ship a copy per card and the extra
   <style> nodes would count as grid children and skew the Reveal stagger.
──────────────────────────────────────────────────────────────────────────── */

export default function ProductCard({
  product,
  priority,
}: {
  product: Product;
  /** Above-the-fold cards skip lazy loading so the grid does not pop in. */
  priority?: boolean;
}) {
  const { add } = useCart();
  const [hovered, setHovered] = useState(false);

  const [primary, secondary] = product.images;
  const sizes = product.options.find((o) => o.name === 'Size')?.values ?? [];
  const isOneSize = sizes.length <= 1;
  const soldOut = !product.availableForSale;

  const onSale = product.variants.some(
    (v) => v.compareAtPrice && v.compareAtPrice.amount > v.price.amount
  );
  const compareAt = product.variants.find((v) => v.compareAtPrice)?.compareAtPrice;

  const variantForSize = (size: string) =>
    product.variants.find((v) => v.selectedOptions.Size === size);

  const quickAdd = (size: string) => {
    const variant = variantForSize(size);
    if (variant?.availableForSale) add(variant.id);
  };

  const addOneSize = () => {
    const variant = product.variants.find((v) => v.availableForSale);
    if (variant) add(variant.id);
  };

  return (
    <article
      className="pcard"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* The quick-add rail is a sibling of the media link, not a child:
          buttons nested inside an anchor are invalid and swallow the click. */}
      <div className="pcard-frame">
        <Link href={`/shop/${product.handle}`} className="pcard-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="pcard-img"
            src={imageUrl(primary?.url ?? '', 900)}
            alt={primary?.altText ?? product.title}
            loading={priority ? 'eager' : 'lazy'}
          />
          {secondary && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className="pcard-img pcard-img-alt"
              data-show={hovered || undefined}
              src={imageUrl(secondary.url, 900)}
              alt=""
              aria-hidden
              loading="lazy"
            />
          )}
        </Link>

        {soldOut && <span className="pcard-badge">Sold Out</span>}
        {!soldOut && product.tags.includes('new') && (
          <span className="pcard-badge">New</span>
        )}

        {!soldOut && (
          <div className="pcard-quick" data-show={hovered || undefined}>
            {isOneSize ? (
              <button onClick={addOneSize} className="pcard-quick-one">
                Quick Add
              </button>
            ) : (
              sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => quickAdd(size)}
                  disabled={!variantForSize(size)?.availableForSale}
                  aria-label={`Add ${product.title}, size ${size}`}
                >
                  {size}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="pcard-meta">
        <Link href={`/shop/${product.handle}`} className="pcard-name">
          {product.title}
        </Link>
        <p className="pcard-price">
          {onSale && compareAt && <s>{formatMoney(compareAt)}</s>}
          {formatMoney(product.priceRange.min)}
        </p>
        <p className="pcard-color">
          {product.options.find((o) => o.name === 'Color')?.values.join(' / ')}
        </p>
      </div>
    </article>
  );
}
