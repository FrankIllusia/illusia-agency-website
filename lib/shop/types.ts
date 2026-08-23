/* ── Shop domain types ────────────────────────────────────────────────────────
   Deliberately shaped like Shopify's Storefront API rather than like Tapstitch.
   Tapstitch has no public API — it is a design + fulfilment tool that publishes
   into a store platform — so Shopify is the read model, and Tapstitch reaches
   us only indirectly, through whatever it has synced into the store.

   Everything downstream (cards, PDP, cart) consumes these types and nothing
   else, so swapping the seed catalogue for the live store is a data-layer
   change with no component churn.
──────────────────────────────────────────────────────────────────────────── */

export type Money = {
  /** Major units, e.g. 118 for $118.00. */
  amount: number;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string;
};

export type ProductOption = {
  /** 'Size', 'Color' — Shopify allows up to three per product. */
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  price: Money;
  /** Set when the item is on sale; drives the struck-through compare price. */
  compareAtPrice: Money | null;
  availableForSale: boolean;
  /** e.g. `{ Size: 'L', Color: 'Washed Black' }` */
  selectedOptions: Record<string, string>;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  /** Shopify returns rich text for the PDP body; the seed catalogue fakes it. */
  descriptionHtml: string;
  tags: string[];
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: { min: Money; max: Money };
  availableForSale: boolean;
};

/** What we persist to localStorage. Deliberately minimal — titles, prices and
    images are re-resolved from the catalogue on every render so a price change
    in Shopify can never be masked by a stale cart snapshot. */
export type CartLine = {
  variantId: string;
  quantity: number;
};

/** A cart line joined back to its catalogue entry, ready to render. */
export type ResolvedCartLine = {
  line: CartLine;
  product: Product;
  variant: ProductVariant;
  lineTotal: Money;
};
