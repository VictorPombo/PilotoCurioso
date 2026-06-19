import type { Metadata } from 'next';
// @ts-ignore
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';

export const metadata: Metadata = {
  title: {
    default: 'Piloto Curioso — Curiosidades e Bastidores da F1',
    template: '%s — Piloto Curioso',
  },
  description:
    'Curiosidades, bastidores, engenharia explicada e história da Fórmula 1. Conteúdo autoral por Enzo de Souza.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://piloto-curioso.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Piloto Curioso',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-1 text-white antialiased">
        <Navbar />
        <div className="pt-[70px] min-h-screen flex flex-col">
          {children}
        </div>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
