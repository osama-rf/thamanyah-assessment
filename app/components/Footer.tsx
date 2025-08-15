'use client';

import { useLanguage } from '@/app/contexts/LanguageContext';
import { ThamanyahIcon } from './ThamanyahIcon';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {language === 'ar' ? (
              // Arabic RTL layout: text first, then icon
              <>
                <div className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  {t('footer.builtBy')}{' '}
                  <a
                    href="https://osama-rf.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground hover:opacity-80 transition-opacity border-b-2 border-primary pb-1"
                  >
                  </a>
                </div>
                <a
                  href="https://thmanyah.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                >
                  <ThamanyahIcon
                    width={80}
                    height={80}
                    className="text-muted-foreground sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px]"
                  />
                </a>
              </>
            ) : (
              // English LTR layout: text, icon, then "Assignment"
              <>
                <div className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  {t('footer.builtBy')}{' '}
                  <a
                    href="https://osama-rf.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground hover:opacity-80 transition-opacity border-b-2 border-primary pb-1"
                  >
                  </a>
                </div>
                <a
                  href="https://thmanyah.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                >
                  <ThamanyahIcon
                    width={80}
                    height={80}
                    className="text-muted-foreground sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px]"
                  />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}