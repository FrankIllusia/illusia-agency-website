import type { Money } from './types';

/* Whole amounts render as "$118" rather than "$118.00" — the trailing zeros
   read as clutter at the small type sizes the grid uses. Anything with cents
   still shows them. */
export function formatMoney({ amount, currencyCode }: Money): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

/* Shopify's CDN resizes on the fly from a query param, which is why the shop
   uses plain <img> rather than next/image: no remotePatterns to maintain, no
   optimizer hop, and the seed catalogue's local SVGs pass straight through. */
export function imageUrl(url: string, width: number): string {
  if (!url.includes('cdn.shopify.com')) return url;
  const u = new URL(url);
  u.searchParams.set('width', String(width));
  return u.toString();
}
