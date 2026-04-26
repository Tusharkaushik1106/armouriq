import type { Metadata } from 'next';
import { Sunflower, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/SmoothScroll';
import { PageCurtain } from '@/components/PageCurtain';
import { CustomCursor } from '@/components/CustomCursor';

const sunflower = Sunflower({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  variable: '--font-sunflower',
  display: 'swap',
  adjustFontFallback: false,
});

const geistMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ArmorIQ — Stop AI agents from going rogue',
  description:
    'The control fabric for autonomous agents. Intercept intent, enforce policy, and ensure every action belongs to an approved purpose.',
  openGraph: {
    title: 'ArmorIQ — Stop AI agents from going rogue',
    description: 'The control fabric for autonomous agents.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sunflower.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-[var(--color-text-dark)]">
        <PageCurtain />
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
