import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeToggleWrapper } from './components/ThemeToggleWrapper';
import { LanguageToggleWrapper } from './components/LanguageToggleWrapper';
import { FooterWrapper } from './components/FooterWrapper';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Thamanyah Assignment - تكليف ثمانية',
  description: 'Search and discover podcasts, music, and more from iTunes with our clean.',
  keywords: 'iTunes, podcasts, search, music, entertainment',
  authors: [{ name: 'Thamanyah Assignment - تكليف ثمانية' }],
  icons: {
    icon: '/Thmanyah-Icon-tab-white.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${ibmPlexSansArabic.className} min-h-screen bg-background antialiased`}>
        <LanguageProvider>
          <ThemeProvider>
            <div id="root" className="min-h-screen flex flex-col relative">
              {/* Language and Theme Toggle Buttons - Fixed in top left corner */}
              {/* <div className="fixed top-4 left-4 z-50 flex items-center gap-2" dir="ltr">
                <LanguageToggleWrapper />
                <ThemeToggleWrapper />
              </div> */}

              {children}

              <FooterWrapper />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}