'use server';

import { createCheckoutUrl } from '@/lib/shop/shopify';
import { isLiveStore } from '@/lib/shop/catalog';
import type { CartLine } from '@/lib/shop/types';

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: 'not-live' | 'empty' | 'error'; message: string };

/**
 * Turns the browser cart into a Shopify checkout URL.
 *
 * Runs on the server because the Storefront token must not reach the client.
 * Until the store exists this reports `not-live`, which the drawer renders as
 * a "coming soon" state rather than a dead button.
 */
export async function startCheckout(lines: CartLine[]): Promise<CheckoutResult> {
  if (!lines.length) {
    return { ok: false, reason: 'empty', message: 'Your bag is empty.' };
  }

  if (!isLiveStore) {
    return {
      ok: false,
      reason: 'not-live',
      message: 'Checkout opens when the store goes live.',
    };
  }

  try {
    const url = await createCheckoutUrl(lines);
    return { ok: true, url };
  } catch (err) {
    console.error('[shop] checkout failed:', err);
    return {
      ok: false,
      reason: 'error',
      message: 'Could not reach checkout. Please try again.',
    };
  }
}
