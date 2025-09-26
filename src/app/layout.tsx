import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import ConditionalHeader from '@/components/ui/ConditionalHeader';
import Footer from '@/components/sections/Footer';
import ChatWidget from '@/components/ui/ChatWidget';
import CookiesConsent from '@/components/ui/CookiesConsent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Bravin AI',
  description: 'Never miss a customer inquiry again. Our AI agent handles inbound messages, qualifies leads, and routes complex issues to your team.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <ConditionalHeader />
        <main className="min-h-screen">
          {children}
        </main>
  <CookiesConsent />
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
