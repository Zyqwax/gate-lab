import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GlobalDialog } from '../components/ui/GlobalDialog';
import { LanguageSync } from '../i18n/LanguageSync';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatelab.dev';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#15161A' },
    { media: '(prefers-color-scheme: light)', color: '#F7F5F0' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GateLab — Digital Logic Circuit Simulator & Visual Playground',
    template: '%s | GateLab',
  },
  description:
    'Interactive digital logic circuit simulator, visual schematic editor, and automated truth table analyzer. Design combinational and sequential circuits with 4-valued logic signals (0, 1, High-Z, X) directly in your browser.',
  applicationName: 'GateLab',
  keywords: [
    'logic gate simulator',
    'digital logic circuit',
    'truth table generator',
    'boolean algebra',
    'logic circuit playground',
    'full adder simulator',
    'SR latch',
    'D flip-flop',
    'digital electronics',
    'computer architecture',
    'mantık devreleri simülatörü',
    'lojik kapılar',
    'doğruluk tablosu',
    'dijital elektronik laboratuvarı',
    'GateLab',
  ],
  authors: [{ name: 'GateLab Team', url: SITE_URL }],
  creator: 'GateLab',
  publisher: 'GateLab',
  category: 'education',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'tr-TR': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: ['/favicon-32x32.png'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#FFB000',
      },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['tr_TR'],
    url: SITE_URL,
    siteName: 'GateLab — Logic Gate Playground',
    title: 'GateLab — Interactive Digital Logic Circuit Simulator',
    description:
      'Design, wire, and simulate digital logic circuits in real-time. Features a 4-valued netlist engine, sequential memory blocks, and one-click truth table generation.',
    images: [
      {
        url: '/og-image.png',
        width: 1120,
        height: 520,
        alt: 'GateLab — Logic Gate Digital Circuit Simulator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GateLab — Interactive Digital Logic Circuit Simulator',
    description:
      'Design, wire, and simulate digital logic circuits in real-time with 4-valued netlist simulation and automatic truth table analysis.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GateLab',
    alternateName: 'Logic Gate — Digital Circuit Simulator',
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    description:
      'Interactive digital logic circuit simulator, visual schematic editor, and automated truth table analyzer in your browser.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <LanguageSync />
        {children}
        <GlobalDialog />
      </body>
    </html>
  );
}
