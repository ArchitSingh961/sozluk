import { Inter } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/components/LenisProvider';
import Providers from './providers';
import ContactModal from '@/components/ContactModal/ContactModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Sözlük | Premium Aluminium Window & Door Systems',
  description: 'Sözlük manufactures premium aluminium window and door profile systems. Sliding systems, casement systems, and architectural aluminium profiles for modern architecture.',
  keywords: 'aluminium profiles, window systems, door systems, sliding windows, casement windows, aluminium frames, architectural aluminium',
  openGraph: {
    title: 'Sözlük | Premium Aluminium Window & Door Systems',
    description: 'Premium aluminium window and door profile systems for modern architecture.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <LenisProvider>
            {children}
            <ContactModal />
          </LenisProvider>
        </Providers>
      </body>
    </html>
  );
}
