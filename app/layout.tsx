import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SiteChrome from './components/SiteChrome';
import { SmoothScroll } from './components/fx';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  // Without this, OG/Twitter image URLs resolve against localhost and every
  // shared link previews broken once deployed.
  metadataBase: new URL('https://illusiaagency.com'),
  title: 'Illusia Agency — Creative Production',
  description: 'We build empires. Cinematic content, brand campaigns, and creative strategy for the world\'s most recognizable brands.',
  openGraph: {
    title: 'Illusia Agency',
    description: 'Creative Production Agency',
    url: 'https://illusiaagency.com',
    siteName: 'Illusia Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@illusiaagency',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Renders nothing — drives window scroll through Lenis and keeps
            ScrollTrigger in sync. Must stay outside anything it animates. */}
        <SmoothScroll />
        {/* Renders the agency nav + intro on marketing routes, nothing on /shop. */}
        <SiteChrome />
        <main>{children}</main>
      </body>
    </html>
  );
}
