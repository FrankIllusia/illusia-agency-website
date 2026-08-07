import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from './components/Nav';
import LoadingScreen from './components/LoadingScreen';
import { SmoothScroll } from './components/fx';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Illusia Agency — Creative Production',
  description: 'We build empires. Cinematic content, brand campaigns, and creative strategy for the world\'s most recognizable brands.',
  openGraph: {
    title: 'Illusia Agency',
    description: 'Creative Production Agency',
    url: 'https://www.illusiaagency.com',
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
        <LoadingScreen />
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
