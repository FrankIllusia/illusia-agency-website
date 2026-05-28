import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from './components/Nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Illusia Agency — AI-Powered Creative Production',
  description: 'We build empires. Cinematic AI content, brand campaigns, and creative strategy for the world\'s most recognizable brands.',
  openGraph: {
    title: 'Illusia Agency',
    description: 'AI-Powered Creative Production Agency',
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
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
