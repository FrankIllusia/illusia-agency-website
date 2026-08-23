import type { Product, ProductVariant } from './types';

/* ── Seed catalogue ───────────────────────────────────────────────────────────
   Stands in for the live store until Shopify exists. Everything here mirrors
   what Tapstitch would sync into Shopify, so `catalog.ts` can swap sources
   without a single component changing.

   This is NOT a permanent product database. Once the Shopify store is live and
   `SHOPIFY_STORE_DOMAIN` is set, this file stops being read at runtime — keep
   it only as the offline/preview fallback.
──────────────────────────────────────────────────────────────────────────── */

const USD = 'USD';
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const ONE_SIZE = ['OS'];

/** Sizes past L tend to be the first to sell out; the seed data mimics that so
    the disabled-swatch styling is actually exercised in preview. */
const SEEDED_SOLD_OUT = new Set(['XS', 'XXL']);

type SeedInput = {
  handle: string;
  title: string;
  /** Colourway label shown on the card and PDP. */
  color: string;
  price: number;
  compareAt?: number;
  description: string;
  tags: string[];
  sizes: string[];
  images: string[];
};

function buildProduct(input: SeedInput): Product {
  const price = { amount: input.price, currencyCode: USD };
  const compareAtPrice = input.compareAt
    ? { amount: input.compareAt, currencyCode: USD }
    : null;

  const variants: ProductVariant[] = input.sizes.map((size) => ({
    id: `seed:${input.handle}:${size.toLowerCase()}`,
    title: input.sizes.length === 1 ? input.color : `${input.color} / ${size}`,
    price,
    compareAtPrice,
    availableForSale: !SEEDED_SOLD_OUT.has(size),
    selectedOptions: { Color: input.color, Size: size },
  }));

  return {
    id: `seed:${input.handle}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    tags: input.tags,
    images: input.images.map((url, i) => ({
      url,
      altText: `${input.title} — ${input.color}${i ? ` (view ${i + 1})` : ''}`,
    })),
    options: [
      { name: 'Color', values: [input.color] },
      { name: 'Size', values: input.sizes },
    ],
    variants,
    priceRange: { min: price, max: price },
    availableForSale: variants.some((v) => v.availableForSale),
  };
}

const img = (name: string) => `/images/shop/${name}.jpg`;

export const SEED_PRODUCTS: Product[] = [
  buildProduct({
    handle: 'ascended-zip-hoodie',
    title: 'Ascended Zip Hoodie',
    color: 'Black',
    price: 128,
    tags: ['new', 'outerwear'],
    sizes: APPAREL_SIZES,
    description:
      'Heavyweight full-zip hood with contrast piping and striped rib cuffs. Old-English "Only The Ascended" script embroidered across the chest.',
    images: [img('ascended-zip-hoodie-1'), img('ascended-zip-hoodie-2')],
  }),
  buildProduct({
    handle: 'ascended-hoodie',
    title: 'Ascended Hoodie',
    color: 'Washed Black',
    price: 118,
    tags: ['new', 'fleece'],
    sizes: APPAREL_SIZES,
    description:
      'Garment-washed pullover hood with a full-back pegasus print and script sleeve hits. Boxy, pre-shrunk, built to fade.',
    images: [img('ascended-hoodie-1'), img('ascended-hoodie-2')],
  }),
  buildProduct({
    handle: 'agency-long-sleeve',
    title: 'Agency Long Sleeve',
    color: 'Navy',
    price: 78,
    tags: ['new', 'tops'],
    sizes: APPAREL_SIZES,
    description:
      'Midweight cotton long sleeve. ILLUSIA AGENCY™ chest lockup with wrapping script down both sleeves.',
    images: [img('agency-long-sleeve-1'), img('agency-long-sleeve-2')],
  }),
  buildProduct({
    handle: 'pegasus-crewneck',
    title: 'Pegasus Crewneck',
    color: 'Espresso',
    price: 98,
    tags: ['fleece'],
    sizes: APPAREL_SIZES,
    description:
      'Brushed-back fleece crewneck in espresso, with the embroidered pegasus mark at the left chest.',
    images: [img('pegasus-crewneck-1'), img('pegasus-crewneck-2')],
  }),
  buildProduct({
    handle: 'icon-tee',
    title: 'Icon Tee',
    color: 'White',
    price: 52,
    tags: ['tops'],
    sizes: APPAREL_SIZES,
    description:
      'Heavy cotton tee with the Illusia orbit mark printed at centre chest. Relaxed body, ribbed collar.',
    images: [img('icon-tee-1'), img('icon-tee-2')],
  }),
  buildProduct({
    handle: 'ascended-trucker',
    title: 'Ascended Trucker',
    color: 'Bone / Gold',
    price: 48,
    tags: ['new', 'headwear'],
    sizes: ONE_SIZE,
    description:
      'Five-panel trucker in bone with a charcoal brim. Gold and black pegasus arch embroidery, "Only the ascended" script beneath.',
    images: [img('ascended-trucker-1'), img('ascended-trucker-2')],
  }),
  buildProduct({
    handle: 'globe-trucker',
    title: 'Globe Trucker',
    color: 'Cream / Navy',
    price: 48,
    tags: ['headwear'],
    sizes: ONE_SIZE,
    description:
      'Cream crown, navy brim, red globe-and-pegasus embroidery with the ILLUSIA AGENCY™ lockup.',
    images: [img('globe-trucker-1'), img('globe-trucker-2')],
  }),
  buildProduct({
    handle: 'pegasus-cap',
    title: 'Pegasus Cap',
    color: 'Black',
    price: 45,
    tags: ['headwear'],
    sizes: ONE_SIZE,
    description:
      'Blacked-out cap with a tonal white pegasus outline at the front panel and side agency lockup.',
    images: [img('pegasus-cap-1'), img('pegasus-cap-2')],
  }),
];
