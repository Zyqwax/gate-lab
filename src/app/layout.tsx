import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GateLab — Logic Circuit Playground',
  description: 'Interactive digital logic circuit simulator, visual editor and truth table analyzer.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2'/><path d='M7 7h10'/><path d='M7 12h10'/><path d='M7 17h10'/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
