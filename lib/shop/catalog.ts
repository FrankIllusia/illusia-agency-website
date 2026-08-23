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
 * Swaps in a placeholder for any product photo that is not on disk yet.
 *
 * The seed catalogue names the real shoot files ahead of time, so dropping
 * the photography into `public/images/shop/` is all it takes to light them
 * up — no code change. Live Shopify images are remote and always pass through.
 */
function withResolvedImages(product: Product): Product {
  const images = product.images.map((image, i) => {
    const isLocal = image.url.startsWith('/');
    if (!isLocal || publicFileExists(image.url)) return image;
    return { ...image, url: placeholderFor(product.handle, i) };
  });

  return { ...product, images };
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

export async function getProducts(): Promise<Product[]> {
  if (!isLiveStore) return SEED_PRODUCTS.map(withResolvedImages);

  try {
    return await fetchCollectionProducts();
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
    return await fetchProduct(handle);
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
