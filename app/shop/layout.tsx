import type { Metadata } from 'next';
import './shop.css';
import { CartProvider } from '../components/shop/CartProvider';
import CartDrawer from '../components/shop/CartDrawer';
import ShopNav from '../components/shop/ShopNav';
import ShopFooter from '../components/shop/ShopFooter';
import { getProducts } from '@/lib/shop/catalog';

/* ── Shop shell ───────────────────────────────────────────────────────────────
   A nested layout rather than a second root layout: route groups with separate
   roots force a full page reload when you cross between them, and the whole
   point is that /shop feels like a different site without ever leaving this one.

   The catalogue is loaded once here and handed to CartProvider so bag lines can
   be resolved to titles, prices and images without a second round trip.
──────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Shop — Illusia Agency',
  description:
    'Illusia Agency apparel and headwear. Printed and shipped on demand.',
  openGraph: {
    title: 'Illusia Agency — Shop',
    description: 'Only the ascended.',
    url: 'https://illusiaagency.com/shop',
  },
  // Unlisted until launch: the route works for anyone with the link but must
  // not turn up in search while it is still being built.
  robots: { index: false, follow: false },
};

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getProducts();

  return (
    <CartProvider products={products}>
      <div className="shop-root">
        <ShopNav />
        <div className="shop-main">{children}</div>
        <ShopFooter />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
