'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
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
    'results.topPodcasts': 'بودكاست عن "{query}"',
    'results.topEpisodes': 'حلقات عن "{query}"',
    'results.noResults': 'ما لقينا نتائج عن "{query}"',
    'results.showing': '.',
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
    'theme.switchToDark': 'غيّر للوضع الداكن',
    'theme.switchToLight': 'غيّر للوضع الفاتح',
    'theme.light': 'الفاتح',
    'theme.dark': 'الداكن',

    // Layout
    'layout.grid': 'شبكة',
    'layout.list': 'قائمة',
    'layout.horizontal': 'أفقي',
    'layout.compact': 'مضغوط',

    // Footer
    'footer.builtBy': 'صُنع بكل حب من أسامة الرفاعي',
    'footer.thamanyah': 'ثمانية',

    // Language
    'language.switchTo': 'Switch to English',
    'language.ar': 'العربية',
    'language.en': 'English',

    // Podcast Genres - Main Categories
    'genre.Arts': 'فنون',
    'genre.Business': 'أعمال',
    'genre.Comedy': 'كوميديا',
    'genre.Education': 'تعليم',
    'genre.Fiction': 'خيال',
    'genre.Government': 'حكومة',
    'genre.History': 'تاريخ',
    'genre.Health & Fitness': 'صحة ولياقة',
    'genre.Kids & Family': 'أطفال وعائلة',
    'genre.Leisure': 'ترفيه',
    'genre.Music': 'موسيقى',
    'genre.News': 'أخبار',
    'genre.Religion & Spirituality': 'دين وروحانيات',
    'genre.Science': 'علوم',
    'genre.Society & Culture': 'مجتمع وثقافة',
    'genre.Sports': 'رياضة',
    'genre.Technology': 'تكنولوجيا',
    'genre.True Crime': 'جرائم حقيقية',
    'genre.TV & Film': 'تلفزيون وأفلام',

    // Arts Subcategories
    'genre.Books': 'كتب',
    'genre.Design': 'تصميم',
    'genre.Fashion & Beauty': 'أزياء وجمال',
    'genre.Food': 'طعام',
    'genre.Performing Arts': 'فنون أدائية',
    'genre.Visual Arts': 'فنون بصرية',

    // Business Subcategories
    'genre.Careers': 'مهن ووظائف',
    'genre.Entrepreneurship': 'ريادة الأعمال',
    'genre.Investing': 'استثمار',
    'genre.Management': 'إدارة',
    'genre.Marketing': 'تسويق',
    'genre.Non-Profit': 'منظمات غير ربحية',

    // Comedy Subcategories
    'genre.Comedy Interviews': 'مقابلات كوميدية',
    'genre.Improv': 'ارتجال كوميدي',
    'genre.Stand-Up': 'كوميديا وقوف',

    // Education Subcategories
    'genre.Courses': 'دورات تعليمية',
    'genre.How To': 'طريقة العمل',
    'genre.Language Learning': 'تعلم اللغات',
    'genre.Self-Improvement': 'تطوير الذات',

    // Fiction Subcategories
    'genre.Comedy Fiction': 'خيال كوميدي',
    'genre.Drama': 'دراما',
    'genre.Science Fiction': 'خيال علمي',

    // Health & Fitness Subcategories
    'genre.Alternative Health': 'طب بديل',
    'genre.Fitness': 'لياقة بدنية',
    'genre.Medicine': 'طب',
    'genre.Mental Health': 'صحة نفسية',
    'genre.Nutrition': 'تغذية',
    'genre.Sexuality': 'صحة جنسية',

    // Kids & Family Subcategories
    'genre.Education for Kids': 'تعليم الأطفال',
    'genre.Parenting': 'تربية الأطفال',
    'genre.Pets & Animals': 'حيوانات أليفة',
    'genre.Stories for Kids': 'قصص الأطفال',

    // Leisure Subcategories
    'genre.Animation & Manga': 'رسوم متحركة ومانجا',
    'genre.Automotive': 'سيارات',
    'genre.Aviation': 'طيران',
    'genre.Crafts': 'حرف يدوية',
    'genre.Games': 'ألعاب',
    'genre.Hobbies': 'هوايات',
    'genre.Home & Garden': 'منزل وحديقة',
    'genre.Video Games': 'ألعاب فيديو',

    // Music Subcategories
    'genre.Music Commentary': 'تعليق موسيقي',
    'genre.Music History': 'تاريخ الموسيقى',
    'genre.Music Interviews': 'مقابلات موسيقية',

    // News Subcategories
    'genre.Business News': 'أخبار اقتصادية',
    'genre.Daily News': 'أخبار يومية',
    'genre.Entertainment News': 'أخبار ترفيهية',
    'genre.News Commentary': 'تعليق إخباري',
    'genre.Politics': 'سياسة',
    'genre.Sports News': 'أخبار رياضية',
    'genre.Tech News': 'أخبار تقنية',

    // Religion & Spirituality Subcategories
    'genre.Buddhism': 'بوذية',
    'genre.Christianity': 'مسيحية',
    'genre.Hinduism': 'هندوسية',
    'genre.Islam': 'إسلام',
    'genre.Judaism': 'يهودية',
    'genre.Religion': 'دين',
    'genre.Spirituality': 'روحانيات',

    // Science Subcategories
    'genre.Astronomy': 'فلك',
    'genre.Chemistry': 'كيمياء',
    'genre.Earth Sciences': 'علوم الأرض',
    'genre.Life Sciences': 'علوم الحياة',
    'genre.Mathematics': 'رياضيات',
    'genre.Natural Sciences': 'علوم طبيعية',
    'genre.Nature': 'طبيعة',
    'genre.Physics': 'فيزياء',
    'genre.Social Sciences': 'علوم اجتماعية',

    // Society & Culture Subcategories
    'genre.Documentary': 'وثائقي',
    'genre.Personal Journals': 'يوميات شخصية',
    'genre.Philosophy': 'فلسفة',
    'genre.Places & Travel': 'أماكن وسفر',
    'genre.Relationships': 'علاقات',

    // Sports Subcategories
    'genre.Baseball': 'بيسبول',
    'genre.Basketball': 'كرة سلة',
    'genre.Cricket': 'كريكت',
    'genre.Fantasy Sports': 'رياضة خيالية',
    'genre.Football': 'كرة قدم أمريكية',
    'genre.Golf': 'جولف',
    'genre.Hockey': 'هوكي',
    'genre.Rugby': 'رجبي',
    'genre.Running': 'جري',
    'genre.Soccer': 'كرة قدم',
    'genre.Swimming': 'سباحة',
    'genre.Tennis': 'تنس',
    'genre.Volleyball': 'كرة طائرة',
    'genre.Wilderness': 'برية',
    'genre.Wrestling': 'مصارعة',

    // TV & Film Subcategories
    'genre.After Shows': 'ما بعد البرامج',
    'genre.Film History': 'تاريخ السينما',
    'genre.Film Interviews': 'مقابلات سينمائية',
    'genre.Film Reviews': 'مراجعات أفلام',
    'genre.TV Reviews': 'مراجعات تلفزيونية',

    // Pagination
    'pagination.loadMore': 'تحميل المزيد',
    'pagination.loading': 'جاري التحميل...',
    'pagination.noMore': 'لا توجد حلقات أخرى',
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
    'results.topPodcasts': 'Top podcasts for "{query}"',
    'results.topEpisodes': 'Top episodes for "{query}"',
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
    'theme.switchToDark': 'Switch to dark mode',
    'theme.switchToLight': 'Switch to light mode',
    'theme.light': 'light',
    'theme.dark': 'dark',

    // Layout
    'layout.grid': 'Grid',
    'layout.list': 'List',
    'layout.horizontal': 'Horizontal',
    'layout.compact': 'Compact',

    // Footer
    'footer.builtBy': 'Built with love by Osama Alrefay with a passion for innovation at',
    'footer.thamanyah': 'Thamanyah',
    'footer.assignment': 'Assignment',

    // Language
    'language.switchTo': 'التبديل إلى العربية',
    'language.ar': 'العربية',
    'language.en': 'English',

    // Podcast Genres - Main Categories
    'genre.Arts': 'Arts',
    'genre.Business': 'Business',
    'genre.Comedy': 'Comedy',
    'genre.Education': 'Education',
    'genre.Fiction': 'Fiction',
    'genre.Government': 'Government',
    'genre.History': 'History',
    'genre.Health & Fitness': 'Health & Fitness',
    'genre.Kids & Family': 'Kids & Family',
    'genre.Leisure': 'Leisure',
    'genre.Music': 'Music',
    'genre.News': 'News',
    'genre.Religion & Spirituality': 'Religion & Spirituality',
    'genre.Science': 'Science',
    'genre.Society & Culture': 'Society & Culture',
    'genre.Sports': 'Sports',
    'genre.Technology': 'Technology',
    'genre.True Crime': 'True Crime',
    'genre.TV & Film': 'TV & Film',

    // Arts Subcategories
    'genre.Books': 'Books',
    'genre.Design': 'Design',
    'genre.Fashion & Beauty': 'Fashion & Beauty',
    'genre.Food': 'Food',
    'genre.Performing Arts': 'Performing Arts',
    'genre.Visual Arts': 'Visual Arts',

    // Business Subcategories
    'genre.Careers': 'Careers',
    'genre.Entrepreneurship': 'Entrepreneurship',
    'genre.Investing': 'Investing',
    'genre.Management': 'Management',
    'genre.Marketing': 'Marketing',
    'genre.Non-Profit': 'Non-Profit',

    // Comedy Subcategories
    'genre.Comedy Interviews': 'Comedy Interviews',
    'genre.Improv': 'Improv',
    'genre.Stand-Up': 'Stand-Up',

    // Education Subcategories
    'genre.Courses': 'Courses',
    'genre.How To': 'How To',
    'genre.Language Learning': 'Language Learning',
    'genre.Self-Improvement': 'Self-Improvement',

    // Fiction Subcategories
    'genre.Comedy Fiction': 'Comedy Fiction',
    'genre.Drama': 'Drama',
    'genre.Science Fiction': 'Science Fiction',

    // Health & Fitness Subcategories
    'genre.Alternative Health': 'Alternative Health',
    'genre.Fitness': 'Fitness',
    'genre.Medicine': 'Medicine',
    'genre.Mental Health': 'Mental Health',
    'genre.Nutrition': 'Nutrition',
    'genre.Sexuality': 'Sexuality',

    // Kids & Family Subcategories
    'genre.Education for Kids': 'Education for Kids',
    'genre.Parenting': 'Parenting',
    'genre.Pets & Animals': 'Pets & Animals',
    'genre.Stories for Kids': 'Stories for Kids',

    // Leisure Subcategories
    'genre.Animation & Manga': 'Animation & Manga',
    'genre.Automotive': 'Automotive',
    'genre.Aviation': 'Aviation',
    'genre.Crafts': 'Crafts',
    'genre.Games': 'Games',
    'genre.Hobbies': 'Hobbies',
    'genre.Home & Garden': 'Home & Garden',
    'genre.Video Games': 'Video Games',

    // Music Subcategories
    'genre.Music Commentary': 'Music Commentary',
    'genre.Music History': 'Music History',
    'genre.Music Interviews': 'Music Interviews',

    // News Subcategories
    'genre.Business News': 'Business News',
    'genre.Daily News': 'Daily News',
    'genre.Entertainment News': 'Entertainment News',
    'genre.News Commentary': 'News Commentary',
    'genre.Politics': 'Politics',
    'genre.Sports News': 'Sports News',
    'genre.Tech News': 'Tech News',

    // Religion & Spirituality Subcategories
    'genre.Buddhism': 'Buddhism',
    'genre.Christianity': 'Christianity',
    'genre.Hinduism': 'Hinduism',
    'genre.Islam': 'Islam',
    'genre.Judaism': 'Judaism',
    'genre.Religion': 'Religion',
    'genre.Spirituality': 'Spirituality',

    // Science Subcategories
    'genre.Astronomy': 'Astronomy',
    'genre.Chemistry': 'Chemistry',
    'genre.Earth Sciences': 'Earth Sciences',
    'genre.Life Sciences': 'Life Sciences',
    'genre.Mathematics': 'Mathematics',
    'genre.Natural Sciences': 'Natural Sciences',
    'genre.Nature': 'Nature',
    'genre.Physics': 'Physics',
    'genre.Social Sciences': 'Social Sciences',

    // Society & Culture Subcategories
    'genre.Documentary': 'Documentary',
    'genre.Personal Journals': 'Personal Journals',
    'genre.Philosophy': 'Philosophy',
    'genre.Places & Travel': 'Places & Travel',
    'genre.Relationships': 'Relationships',

    // Sports Subcategories
    'genre.Baseball': 'Baseball',
    'genre.Basketball': 'Basketball',
    'genre.Cricket': 'Cricket',
    'genre.Fantasy Sports': 'Fantasy Sports',
    'genre.Football': 'Football',
    'genre.Golf': 'Golf',
    'genre.Hockey': 'Hockey',
    'genre.Rugby': 'Rugby',
    'genre.Running': 'Running',
    'genre.Soccer': 'Soccer',
    'genre.Swimming': 'Swimming',
    'genre.Tennis': 'Tennis',
    'genre.Volleyball': 'Volleyball',
    'genre.Wilderness': 'Wilderness',
    'genre.Wrestling': 'Wrestling',

    // TV & Film Subcategories
    'genre.After Shows': 'After Shows',
    'genre.Film History': 'Film History',
    'genre.Film Interviews': 'Film Interviews',
    'genre.Film Reviews': 'Film Reviews',
    'genre.TV Reviews': 'TV Reviews',

    // Pagination
    'pagination.loadMore': 'Load More',
    'pagination.loading': 'Loading...',
    'pagination.noMore': 'No more episodes',
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