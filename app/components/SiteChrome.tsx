'use client';

import { usePathname } from 'next/navigation';
import Nav from './Nav';
import LoadingScreen from './LoadingScreen';

/* ── Site chrome ──────────────────────────────────────────────────────────────
   The agency's floating pill nav and intro animation belong to the marketing
   site, not the storefront — /shop brings its own header.

   Done with a pathname check rather than route groups on purpose: separate
   root layouts would make every crossing between the agency site and the shop
   a full page reload, and the shop is meant to feel like part of the same site.
──────────────────────────────────────────────────────────────────────────── */

export default function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith('/shop')) return null;

  return (
    <>
      <LoadingScreen />
      <Nav />
    </>
  );
}
