'use client';

import { useLanguage } from '@/app/contexts/LanguageContext';
import { ThamanyahIcon } from './ThamanyahIcon';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {language === 'ar' ? (
              // Arabic RTL layout: text first, then icon
              <>
                <div className="text-lg sm:text-xl text-muted-foreground">
                  صُنع بكل حب من{' '}
                  <a
                    href="https://osama-rf.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground hover:opacity-80 transition-opacity border-b-2 border-primary pb-1"
                  >
                    أسامة الرفاعي
                  </a>
                  {' '}لتكليف من
                </div>
                <a
                  href="https://thmanyah.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                >
                  <ThamanyahIcon
                    width={100}
                    height={100}
                    className="text-muted-foreground"
                  />
                </a>
              </>
            ) : (
              // English LTR layout: text, icon, then "Assignment"
              <>
                <div className="text-lg sm:text-xl text-muted-foreground">
                  Built with love by{' '}
                  <a
                    href="https://osama-rf.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground hover:opacity-80 transition-opacity border-b-2 border-primary pb-1"
                  >
                    Osama Alrefay
                  </a>
                  {' '}for
                </div>
                <a
                  href="https://thmanyah.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                >
                  <ThamanyahIcon
                    width={100}
                    height={100}
                    className="text-muted-foreground"
                  />
                </a>
                <p className="text-lg sm:text-xl text-muted-foreground">
                  {t('footer.assignment')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}