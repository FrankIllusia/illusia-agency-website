# Shop — handoff

Branch: `feat/shop`. Started 2026-08-23 by Frank.

> **Do not merge to `main` and do not launch.** Frank calls the launch. `main`
> is the production branch, so merging deploys to illusiaagency.com.
> See "What NOT to do" at the bottom.

## Get running in two minutes

```bash
git fetch origin
git checkout feat/shop
npm install
npm run dev
```

Then open **http://localhost:3000/shop**.

No env vars needed. The shop runs off a seed catalogue (`lib/shop/seed.ts`)
until the Shopify store exists, so everything is browsable offline.

## What this is

A storefront at `/shop` on illusiaagency.com, styled after
representclo.com. Same domain and client-side navigation as the main site, but
its own chrome so it reads as a separate property.

**The thing to understand before touching the data layer:** Tapstitch has no
public API. It publishes products *into* a store platform. So the chain is
Tapstitch → Shopify → Storefront API → this site. Don't try to call Tapstitch.

Full architecture and the launch checklist are in [`SHOP.md`](./SHOP.md).

## Where things are

| Path | What |
| --- | --- |
| `app/shop/page.tsx` | Shop home (hero, rail, editorial, grid) |
| `app/shop/[handle]/page.tsx` | Product detail |
| `app/shop/layout.tsx` | Shop shell — nav, cart provider, footer |
| `app/shop/shop.css` | Styles for anything rendered more than once |
| `app/components/shop/` | All shop UI components |
| `lib/shop/catalog.ts` | Picks live Shopify vs seed. **Server-only** (`node:fs`) |
| `lib/shop/shopify.ts` | Storefront API client + checkout |
| `lib/shop/seed.ts` | Placeholder catalogue, incl. prices and copy |
| `public/images/shop/` | Product + editorial photography |

## Conventions worth matching

- Components are `'use client'` with inline styles plus a trailing
  `<style>{\`…\`}</style>` block. That is the existing house style — see
  `app/components/Work.tsx`.
- **Exception:** anything rendered more than once (i.e. `ProductCard`) puts its
  CSS in `app/shop/shop.css`. An inline block there ships one copy per card and
  the extra `<style>` nodes count as grid children, which breaks the stagger.
- Product images use plain `<img>`, not `next/image`. Shopify's CDN resizes via
  a query param (`lib/shop/format.ts` → `imageUrl`), so there are no
  `remotePatterns` to maintain.
- Scroll animations come from `app/components/fx.tsx` (`Reveal`, `RiseIn`).

## Known gaps — good places to pick up

1. **Photography.** Only six shots exist for eight products, so two photos each
   cover two products. Ascended Hoodie, Pegasus Crewneck and Globe Trucker are
   wearing borrowed frames. Only three products have a second image, so most
   cards do not hover-swap. Drop files into `public/images/shop/` using the
   names in `seed.ts` and they light up automatically — no code change.
2. **Prices are invented.** Everything in `seed.ts` is a guess. Real numbers
   come from Frank, or from Shopify once connected.
3. **No search, no wishlist, no size guide.** Represent has all three.
4. **Colourways.** Each Tapstitch colourway syncs to Shopify as its own product,
   so the PDP has no colour switcher. If we want linked colourways, that needs a
   `metafield` or a naming convention.
5. **Category filters** are tag-driven (`new`, `apparel`, `headwear`) and
   filtered client-side from the full catalogue. Fine at this size; would need
   real collection queries past ~50 products.

## What NOT to do

- **Don't merge to `main`.** That deploys to production.
- **Don't remove `robots: { index: false, follow: false }`** from
  `app/shop/layout.tsx`.
- **Don't add a Shop link to `app/components/Nav.tsx`.** Keeping it out is what
  makes the route undiscoverable.

Those three are the entire "is it launched" switch. Frank flips them.
