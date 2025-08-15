'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { ResponsiveSearchBar } from './ResponsiveSearchBar';
import { ToggleButtons } from './ToggleButtons';

interface HeaderProps {
  onSearch: (query: string, skipUrlUpdate?: boolean) => void;
  isLoadingPodcasts: boolean;
  isLoadingEpisodes: boolean;
  searchQuery: string;
}

export function Header({ onSearch, isLoadingPodcasts, isLoadingEpisodes, searchQuery }: HeaderProps) {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);


  return (
    <>
      {/* Fixed header at top */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
        <div className="max-w-6xl mx-auto px-2 py-2 sm:px-4 sm:py-3 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4" dir="ltr">
            {/* Toggle buttons - always visible */}
            <div className="flex-shrink-0">
              <ToggleButtons isScrolled={true} />
            </div>

            {/* Search bar and Logo - together in right corner */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
              <div className="w-40 sm:w-64 md:w-80 lg:w-96">
                <ResponsiveSearchBar
                  onSearch={onSearch}
                  isLoading={isLoadingPodcasts || isLoadingEpisodes}
                  placeholder={t('search.placeholder')}
                  enableInstantSearch={false}
                  initialValue={searchQuery}
                  isCompact={true}
                />
              </div>
              
              <img 
                src="/Thmanyah-Icon-tab.svg" 
                alt="Thamanyah Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" 
                style={{ filter: isDarkMode ? 'brightness(0) invert(1)' : 'brightness(0)' }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-24"></div>

    </>
  );
}