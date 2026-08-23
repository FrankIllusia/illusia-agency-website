import ShopHome, { type EditorialArt } from '../components/shop/ShopHome';
import { featuredFrom, getProducts, resolveLocalImage } from '@/lib/shop/catalog';

const VALID_CATEGORIES = ['new', 'apparel', 'headwear'];

/* Editorial art direction is chosen here rather than in the client component
   so the missing-file fallback can run on the server, where `fs` exists. */
function editorialArt(): EditorialArt {
  return {
    hero: resolveLocalImage('/images/shop/editorial-hero.jpg'),
    splitLeft: resolveLocalImage('/images/shop/editorial-apparel.jpg'),
    splitRight: resolveLocalImage('/images/shop/editorial-headwear.jpg'),
    banner: resolveLocalImage('/images/shop/editorial-banner.jpg'),
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { c } = await searchParams;
  const products = await getProducts();

  // Anything unrecognised falls through to the full grid rather than an empty
  // one — a stale or hand-typed ?c= should never look like a broken shop.
  const raw = Array.isArray(c) ? c[0] : c;
  const activeCategory = raw && VALID_CATEGORIES.includes(raw) ? raw : null;

  return (
    <ShopHome
      products={products}
      featured={featuredFrom(products)}
      activeCategory={activeCategory}
      art={editorialArt()}
    />
  );
}
