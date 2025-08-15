'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation strings
const translations = {
  ar: {
    // Header
    'header.title': 'ابحث عن برامج بودكاست رهيبة',
    'header.subtitle': 'دور بين مجموعة iTunes الكبيرة من البودكاست بواجهة سهلة وسريعة. بتلقى البودكاست اللي يعجبك أكيد.',

    // Search
    'search.placeholder': 'دور على بودكاست...',
    'search.button': 'دور',
    'search.searching': 'قاعد يدور...',
    'search.clear': 'مسح البحث',

    // Results
    'results.topPodcasts': ' بودكاست عن "{query}"',
    'results.topEpisodes': ' حلقات عن "{query}"',
    'results.noResults': 'ما لقينا نتائج عن "{query}"',
    'results.showing': 'نعرض لك بودكاست من iTunes',
    'results.episodes': 'حلقات',
    'results.episode': 'حلقة',

    // Popular podcasts
    'popular.title': 'بودكاست عربية مميزة',
    'popular.subtitle': 'مجموعة من أفضل البودكاست العربية المتوفرة على Apple Podcasts',

    // Empty states
    'empty.title': 'ابدأ رحلة البودكاست',
    'empty.subtitle': 'اكتب كلمة فوق عشان نلقى لك بودكاست من iTunes. تقدر تدور باسم البرنامج أو المقدم أو حتى الموضوع وتلقى شي يعجبك.',
    'empty.noResults.title': 'ما لقينا بودكاست',
    'empty.noResults.subtitle': 'جرب كلمات ثانية أو تأكد من الإملاء.',

    // Errors
    'error.search': 'البحث ما ضبط',
    'error.unexpected': 'صار خطأ غير متوقع',
    'error.retry': 'حاول مرة ثانية',

    // Cache
    'cache.results': 'النتائج من التخزين المؤقت',

    // Theme
    'theme.switchTo': 'غيّر للوضع {mode}',
    'theme.light': 'الفاتح',
    'theme.dark': 'الداكن',

    // Layout
    'layout.grid': 'شبكة',
    'layout.list': 'قائمة',
    'layout.horizontal': 'أفقي',
    'layout.compact': 'مضغوط',

    // Footer
    'footer.builtBy': 'صُنع بكل حب من أسامة الرفاعي لتكليف',
    'footer.thamanyah': 'ثمانية',

    // Language
    'language.switchTo': 'Switch to English',
    'language.ar': 'العربية',
    'language.en': 'English',
  },
  en: {
    // Header
    'header.title': 'Discover Amazing Podcasts',
    'header.subtitle': 'Search through iTunes vast collection of podcasts with our clean, fast interface. Find your next favorite show.',

    // Search
    'search.placeholder': 'Search for podcasts...',
    'search.button': 'Search',
    'search.searching': 'Searching...',
    'search.clear': 'Clear search',

    // Results
    'results.topPodcasts': 'Top podcasts of "{query}"',
    'results.topEpisodes': 'Top episodes of "{query}"',
    'results.noResults': 'No results found for "{query}"',
    'results.showing': 'Showing podcasts from iTunes',
    'results.episodes': 'episodes',
    'results.episode': 'episode',

    // Popular podcasts
    'popular.title': 'Featured Arabic Podcasts',
    'popular.subtitle': 'Discover top-rated Arabic podcasts available on Apple Podcasts',

    // Empty states
    'empty.title': 'Start Your Podcast Discovery',
    'empty.subtitle': 'Enter a search term above to find podcasts from iTunes. Search by show name, host, or topic to discover something new.',
    'empty.noResults.title': 'No podcasts found',
    'empty.noResults.subtitle': 'Try searching with different keywords or check your spelling.',

    // Errors
    'error.search': 'Search failed',
    'error.unexpected': 'An unexpected error occurred',
    'error.retry': 'Retry',

    // Cache
    'cache.results': 'Results from cache',

    // Theme
    'theme.switchTo': 'Switch to {mode} mode',
    'theme.light': 'light',
    'theme.dark': 'dark',

    // Layout
    'layout.grid': 'Grid',
    'layout.list': 'List',
    'layout.horizontal': 'Horizontal',
    'layout.compact': 'Compact',

    // Footer
    'footer.builtBy': 'Built with love by Osama Alrefay for',
    'footer.thamanyah': 'Thamanyah',
    'footer.assignment': 'Assignment',

    // Language
    'language.switchTo': 'التبديل إلى العربية',
    'language.ar': 'العربية',
    'language.en': 'English',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar'); // Default to Arabic
  const [mounted, setMounted] = useState(false);

  // Check for saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    setLanguage(savedLanguage || 'ar'); // Default to Arabic if no saved preference
    setMounted(true);
  }, []);

  // Apply language and direction to document
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key;

    // Replace placeholders with parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }

    return translation;
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage,
      t,
      isRTL: language === 'ar'
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}