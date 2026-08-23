import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '../../components/shop/ProductDetail';
import { getProduct, getProducts } from '@/lib/shop/catalog';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: 'Not found — Illusia Shop' };

  return {
    title: `${product.title} — Illusia Agency`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
    robots: { index: false, follow: false },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  // Fill the "you may also like" row from the same curated set, so a product
  // pulled from the collection can never be surfaced by a sibling's page.
  const all = await getProducts();
  const related = all.filter((p) => p.handle !== handle).slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
