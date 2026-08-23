# Shop — how it works and how to launch it

The shop lives at `/shop` on illusiaagency.com. It is **not launched**: it is
unlinked from the main nav and marked `noindex`, so it is reachable only by
typing the URL.

## Why there is a Shopify store in the middle

Tapstitch has **no public API**. It is a design and fulfilment tool that
publishes products *into* a store platform (Shopify, Etsy, Wix, Squarespace,
BigCommerce, WooCommerce, TikTok Shop). There is no way to read products out of
Tapstitch directly, so the chain is:

```
Tapstitch  ──publishes──▶  Shopify  ──Storefront API──▶  illusiaagency.com/shop
   (design + fulfilment)     (catalogue + checkout)         (the storefront)
```

Customers browse, view products and build their bag entirely on illusiaagency.com.
The **only** handoff is the payment page, which Shopify hosts — custom checkout
is Shopify Plus only. That page can be branded and served from
`shop.illusiaagency.com`.

## Curating what appears

Publishing a product from Tapstitch to Shopify does **not** put it on the site.
The storefront reads exactly one Shopify collection, named by
`SHOPIFY_SHOP_COLLECTION` (default `illusia-shop`).

To change the lineup: open the Shopify admin, add or remove products from the
**Illusia Shop** collection. No code change, no deploy. Anything outside that
collection is invisible to the site even though it still exists in Shopify.

Tags drive the category filters:

| Tag        | Where it shows                        |
| ---------- | ------------------------------------- |
| `new`      | "Latest" rail + `/shop?c=new`         |
| `apparel`  | `/shop?c=apparel`                     |
| `headwear` | `/shop?c=headwear`                    |

## Going live — checklist

1. **Create a Shopify store.** Basic (~$39/mo) or higher. Starter does not
   include the Headless channel.
2. **Install the Tapstitch app** in Shopify and connect the Tapstitch account.
   Publish the products you want to sell.
3. **Create a collection** called `Illusia Shop` with handle `illusia-shop`, and
   add the products that should appear on the site.
4. **Tag** each product with `apparel` or `headwear`, and `new` where relevant.
5. **Install the Headless channel** in Shopify. It generates a public Storefront
   API token. Enable at minimum:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
6. **Set env vars** in Vercel (Production + Preview) — see `.env.example`:
   ```
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   SHOPIFY_SHOP_COLLECTION=illusia-shop
   ```
7. **Redeploy.** The seed catalogue stops being read the moment
   `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are both set.
8. **Flip it public** (see below).

## Flipping it public

Two deliberate switches keep it hidden. Both must be undone at launch:

1. `app/shop/layout.tsx` — remove `robots: { index: false, follow: false }`.
2. `app/components/Nav.tsx` — add `{ label: 'Shop', href: '/shop' }` to `links`.
   Note those entries are same-page scroll anchors; a `/shop` entry needs to be
   rendered as a `<Link>` rather than a scroll button.

## Product photography

`lib/shop/seed.ts` names the shoot files it expects, e.g.
`/images/shop/ascended-hoodie-1.jpg`. Any file that is not on disk is swapped
for a generated placeholder at render time (`lib/shop/catalog.ts`), so the shop
is never visibly broken. Drop the real files into `public/images/shop/` using
those names and they light up with no code change.

Editorial slots, same rule:

- `editorial-hero.jpg` — full-bleed hero
- `editorial-apparel.jpg` / `editorial-headwear.jpg` — the two split cells
- `editorial-banner.jpg` — lookbook banner

Once Shopify is live, product images come from the Shopify CDN instead and the
local files only back the editorial slots.

## Architecture notes

- `lib/shop/types.ts` — domain types, shaped like the Storefront API.
- `lib/shop/shopify.ts` — Storefront client, queries, `cartCreate` for checkout.
- `lib/shop/seed.ts` — offline catalogue. Not a product database; delete once
  the store is the source of truth.
- `lib/shop/catalog.ts` — picks live vs seed, resolves missing images.
  **Server-only** (uses `node:fs`).
- `app/shop/actions.ts` — server action exchanging the bag for a checkout URL.
- `app/components/shop/CartProvider.tsx` — bag in `localStorage`, holding only
  variant ids and quantities. Titles and prices are re-resolved from the
  catalogue on every render so a stale bag can never show a stale price.
- The bag is only sent to Shopify at checkout, not mirrored on every add. That
  keeps it instant, and Shopify re-prices and re-checks stock at the one moment
  it matters.
- `app/components/SiteChrome.tsx` — hides the agency nav and intro on `/shop`.
  Done with a pathname check rather than separate root layouts, because
  separate roots force a full page reload when crossing between the two.
