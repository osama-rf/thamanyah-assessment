'use client';

import { useLanguage } from '@/app/contexts/LanguageContext';
import { cn } from '@/app/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "clean-button",
        "relative h-10 w-16 rounded-full",
        "text-foreground hover:text-accent-foreground",
        "transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "border border-border/50 hover:border-border",
        "text-sm font-medium",
        className
      )}
      aria-label={t('language.switchTo')}
      title={t('language.switchTo')}
    >
      <div className="flex items-center justify-center">
        {/* Language Text */}
        <span>
          {language === 'ar' ? 'EN' : 'عربي'}
        </span>
      </div>

    </button>
  );
}