import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { Footer } from '@/components/footer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: 'LinkedIn Post Generator - AI-Powered Content Creation',
  description: 'Generate engaging LinkedIn posts with AI. Create long-form content, short posts, and carousels effortlessly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased flex flex-col min-h-screen`}>
        {children}
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
