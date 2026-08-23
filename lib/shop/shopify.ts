import type { Money, Product, ProductVariant, CartLine } from './types';

/* ── Shopify Storefront API ───────────────────────────────────────────────────
   The read side of the shop. Tapstitch publishes products into Shopify; we
   read a single curated collection back out. Nothing here talks to Tapstitch
   directly, because Tapstitch exposes no public API.

   Curation lives in Shopify, not in code: only products sitting in the
   collection named by SHOPIFY_SHOP_COLLECTION are ever rendered, so the team
   can add or pull items from the Shopify admin with no deploy.
──────────────────────────────────────────────────────────────────────────── */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/** Shopify ships a new API version each quarter and supports each for a year.
    Bump via env when the current one nears end of life — no code change. */
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? '2026-07';

/** The one collection the storefront reads. Anything outside it is invisible
    to the site even though it still exists in Shopify. */
export const SHOP_COLLECTION = process.env.SHOPIFY_SHOP_COLLECTION ?? 'illusia-shop';

export function isShopifyConfigured(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  /** Product reads are cached; cart mutations must not be. */
  revalidate: number | false = 300
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error('Shopify is not configured');
  }

  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: revalidate === false ? { revalidate: 0 } : { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Shopify responded ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  // Shopify returns 200 with a populated `errors` array on query failures, so
  // res.ok alone is not enough to know the call succeeded.
  if (json.errors?.length) {
    throw new Error(`Shopify: ${json.errors.map((e) => e.message).join('; ')}`);
  }
  if (!json.data) throw new Error('Shopify returned no data');

  return json.data;
}

/* ── Wire shapes ──────────────────────────────────────────────────────────── */

type MoneyNode = { amount: string; currencyCode: string };

type ProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  availableForSale: boolean;
  options: { name: string; values: string[] }[];
  priceRange: { minVariantPrice: MoneyNode; maxVariantPrice: MoneyNode };
  images: { nodes: { url: string; altText: string | null }[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: MoneyNode;
      compareAtPrice: MoneyNode | null;
      selectedOptions: { name: string; value: string }[];
    }[];
  };
};

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    availableForSale
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      nodes {
        url
        altText
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

/* ── Normalisers ──────────────────────────────────────────────────────────── */

/* Shopify sends money amounts as strings to avoid float drift on the wire;
   we parse once here so nothing downstream has to think about it. */
const toMoney = (m: MoneyNode): Money => ({
  amount: Number.parseFloat(m.amount),
  currencyCode: m.currencyCode,
});

function normalizeProduct(node: ProductNode): Product {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    tags: node.tags,
    availableForSale: node.availableForSale,
    options: node.options,
    images: node.images.nodes.map((i) => ({
      url: i.url,
      altText: i.altText ?? node.title,
    })),
    variants: node.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: toMoney(v.price),
      compareAtPrice: v.compareAtPrice ? toMoney(v.compareAtPrice) : null,
      selectedOptions: Object.fromEntries(
        v.selectedOptions.map((o) => [o.name, o.value])
      ),
    })),
    priceRange: {
      min: toMoney(node.priceRange.minVariantPrice),
      max: toMoney(node.priceRange.maxVariantPrice),
    },
  };
}

/* ── Reads ────────────────────────────────────────────────────────────────── */

export async function fetchCollectionProducts(
  handle = SHOP_COLLECTION
): Promise<Product[]> {
  const data = await storefront<{
    collection: { products: { nodes: ProductNode[] } } | null;
  }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query CollectionProducts($handle: String!) {
        collection(handle: $handle) {
          products(first: 100) {
            nodes {
              ...ProductFields
            }
          }
        }
      }
    `,
    { handle }
  );

  // A missing collection is a curation mistake, not a crash: render an empty
  // shop rather than a 500 while someone sorts the Shopify admin out.
  if (!data.collection) return [];

  return data.collection.products.nodes.map(normalizeProduct);
}

export async function fetchProduct(handle: string): Promise<Product | null> {
  const data = await storefront<{ product: ProductNode | null }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query SingleProduct($handle: String!) {
        product(handle: $handle) {
          ...ProductFields
        }
      }
    `,
    { handle }
  );

  return data.product ? normalizeProduct(data.product) : null;
}

/* ── Checkout ─────────────────────────────────────────────────────────────── */

/**
 * Exchanges the browser's cart for a Shopify checkout URL.
 *
 * The cart is built fresh at checkout time from the lines the client is
 * holding, rather than mirrored into Shopify on every add. That keeps the
 * cart instant and offline-tolerant, and it means Shopify re-prices and
 * re-checks stock at the one moment it actually matters.
 */
export async function createCheckoutUrl(lines: CartLine[]): Promise<string> {
  const data = await storefront<{
    cartCreate: {
      cart: { checkoutUrl: string } | null;
      userErrors: { message: string }[];
    };
  }>(
    /* GraphQL */ `
      mutation CreateCart($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            checkoutUrl
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      lines: lines.map((l) => ({
        merchandiseId: l.variantId,
        quantity: l.quantity,
      })),
    },
    false
  );

  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join('; '));
  }
  if (!cart) throw new Error('Shopify did not return a checkout');

  return cart.checkoutUrl;
}

export type { ProductVariant };
