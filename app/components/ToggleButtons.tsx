'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface ToggleButtonsProps {
  isScrolled?: boolean;
}

export function ToggleButtons({ isScrolled = false }: ToggleButtonsProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const buttonSize = isScrolled ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`${buttonSize} flex items-center justify-center rounded-lg bg-muted/70 hover:bg-muted transition-all duration-300 ease-out backdrop-blur-sm`}
        title={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
      >
        {theme === 'light' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={`${buttonSize} flex items-center justify-center rounded-lg bg-muted/70 hover:bg-muted transition-all duration-300 ease-out backdrop-blur-sm text-xs font-medium`}
        title={t('language.switchTo')}
      >
        {language === 'ar' ? 'EN' : 'ع'}
      </button>
    </div>
  );
}