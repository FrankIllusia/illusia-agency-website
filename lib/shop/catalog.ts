import fs from 'node:fs';
import path from 'node:path';

import { SEED_PRODUCTS } from './seed';
import {
  fetchCollectionProducts,
  fetchProduct,
  isShopifyConfigured,
} from './shopify';
import type { Product } from './types';

/* ── Catalogue ────────────────────────────────────────────────────────────────
   The single place the rest of the shop asks for products. Reads the live
   Shopify collection when the store is configured and falls back to the seed
   catalogue otherwise, so /shop is fully browsable before the store exists.

   Server-only — this touches `node:fs` to resolve missing product photography.
   Import it from server components and hand the result down as props.
──────────────────────────────────────────────────────────────────────────── */

export const isLiveStore = isShopifyConfigured();

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PLACEHOLDER_COUNT = 4;

/* Existence checks are cached for the life of the process — the answer only
   changes on redeploy, and the grid would otherwise stat the same files on
   every render. */
const existsCache = new Map<string, boolean>();

function publicFileExists(urlPath: string): boolean {
  const cached = existsCache.get(urlPath);
  if (cached !== undefined) return cached;

  const exists = fs.existsSync(path.join(PUBLIC_DIR, urlPath));
  existsCache.set(urlPath, exists);
  return exists;
}

/* Hashed rather than random so a given product always gets the same
   placeholder — otherwise the grid reshuffles between server and client and
   React reports a hydration mismatch. */
function placeholderFor(seed: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const n = (Math.abs(hash) + index) % PLACEHOLDER_COUNT;
  return `/images/shop/placeholder-${n + 1}.svg`;
}

/**
 * Drops product photos that are not on disk yet, and falls back to a
 * placeholder only when a product has no usable image at all.
 *
 * Dropping rather than substituting matters for the second image: the card
 * cross-fades to it on hover, so a placeholder there would make hovering look
 * like a loading failure. Better to show one good shot and no swap.
 *
 * The seed catalogue names the shoot files optimistically, so dropping more
 * photography into `public/images/shop/` lights it up with no code change.
 * Live Shopify images are remote and always pass through.
 */
function withResolvedImages(product: Product): Product {
  const present = product.images.filter(
    (image) => !image.url.startsWith('/') || publicFileExists(image.url)
  );

  if (present.length) return { ...product, images: present };

  return {
    ...product,
    images: [
      {
        url: placeholderFor(product.handle, 0),
        altText: `${product.title} — photography coming soon`,
      },
    ],
  };
}

/**
 * Same fallback for editorial art direction as for product shots.
 *
 * Called from server components, which then hand plain URLs to the client —
 * the placeholder decision must not leak into the browser bundle.
 */
export function resolveLocalImage(urlPath: string, seed = urlPath): string {
  if (!urlPath.startsWith('/') || publicFileExists(urlPath)) return urlPath;
  return placeholderFor(seed, 0);
}

/* ── Shoot photography for live products ─────────────────────────────────────
   Printful/Tapstitch only sync flat mockups into Shopify. The 2026 merch shoot
   (Dropbox: Illusia Agency/Illusia Merch 2026) is layered in front of them
   here, so the card and PDP lead with a person wearing the piece and the
   mockups follow as detail shots.

   Keyed by Shopify handle. A key also matches handles that extend it, because
   the fulfilment apps derive handles from long product titles
   ("pegasus-x-ray-vintage-washed-long-sleeve-…").
──────────────────────────────────────────────────────────────────────────── */
const SHOOT_PHOTOS: Record<string, string[]> = {
  'illusia-global-cap': [
    '/images/shop/illusia-global-cap-1.jpg',
    '/images/shop/illusia-global-cap-2.jpg',
    '/images/shop/illusia-global-cap-3.jpg',
  ],
  'la-flame': ['/images/shop/la-flame-1.jpg', '/images/shop/la-flame-2.jpg'],
  'ascended-hat': [
    '/images/shop/ascended-hat-1.jpg',
    '/images/shop/ascended-hat-2.jpg',
    '/images/shop/ascended-hat-3.jpg',
  ],
  'pegasus-x-ray': [
    '/images/shop/pegasus-xray-long-sleeve-1.jpg',
    '/images/shop/pegasus-xray-long-sleeve-2.jpg',
    '/images/shop/pegasus-xray-long-sleeve-3.jpg',
  ],
};

function shootPhotosFor(handle: string): string[] {
  for (const [key, photos] of Object.entries(SHOOT_PHOTOS)) {
    if (handle === key || handle.startsWith(`${key}-`)) return photos;
  }
  return [];
}

function withShootPhotos(product: Product): Product {
  const shoot = shootPhotosFor(product.handle)
    .filter(publicFileExists)
    .map((url) => ({ url, altText: `${product.title} — worn` }));

  return shoot.length ? { ...product, images: [...shoot, ...product.images] } : product;
}

/* ── Category tags ────────────────────────────────────────────────────────────
   The shop's filters read the `apparel` / `headwear` / `new` tags. Products
   synced from Printful/Tapstitch arrive untagged, so a missed tag would leave
   a category page empty — infer the category from the title instead, and
   treat the whole catalogue as "new" until anything is tagged `new` (at
   launch, everything is). Explicit Shopify tags always win.
──────────────────────────────────────────────────────────────────────────── */
const HEADWEAR = /\b(cap|hat|trucker|snapback|beanie|bucket)\b/i;
const APPAREL = /\b(tee|t-shirt|shirt|sleeve|hood(ie)?|crew(neck)?|jersey|sweat\w*|jacket|zip|pants?|shorts?)\b/i;

function withCategoryTags(products: Product[]): Product[] {
  const anyNew = products.some((p) => p.tags.includes('new'));

  return products.map((p) => {
    const tags = new Set(p.tags);
    if (!tags.has('apparel') && !tags.has('headwear')) {
      // Title first; names like "LA FLAME" say nothing, so fall back to the
      // synced description ("The 5 panel cap is…").
      for (const text of [p.title, p.description]) {
        if (HEADWEAR.test(text) || /\bheadwear\b/i.test(text)) tags.add('headwear');
        else if (APPAREL.test(text)) tags.add('apparel');
        if (tags.has('headwear') || tags.has('apparel')) break;
      }
    }
    if (!anyNew) tags.add('new');
    return tags.size === p.tags.length ? p : { ...p, tags: [...tags] };
  });
}

export async function getProducts(): Promise<Product[]> {
  if (!isLiveStore) return SEED_PRODUCTS.map(withResolvedImages);

  try {
    return withCategoryTags((await fetchCollectionProducts()).map(withShootPhotos));
  } catch (err) {
    // A Shopify outage should degrade to a browsable shop, not a broken page.
    console.error('[shop] falling back to seed catalogue:', err);
    return SEED_PRODUCTS.map(withResolvedImages);
  }
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isLiveStore) {
    const seeded = SEED_PRODUCTS.find((p) => p.handle === handle);
    return seeded ? withResolvedImages(seeded) : null;
  }

  try {
    const product = await fetchProduct(handle);
    return product ? withShootPhotos(product) : null;
  } catch (err) {
    console.error(`[shop] product "${handle}" fetch failed:`, err);
    const seeded = SEED_PRODUCTS.find((p) => p.handle === handle);
    return seeded ? withResolvedImages(seeded) : null;
  }
}

/** Products carrying the `new` tag, for the "Latest" rail. Falls back to the
    first few so the rail is never empty on a freshly tagged store. */
export function featuredFrom(products: Product[], limit = 4): Product[] {
  const tagged = products.filter((p) => p.tags.includes('new'));
  return (tagged.length ? tagged : products).slice(0, limit);
}
