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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleMobileSearchStateChange = (isOpen: boolean) => {
    setIsMobileSearchOpen(isOpen);
  };

  return (
    <>
      {/* Fixed header at top */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" dir="ltr">
            {/* Toggle buttons */}
            <ToggleButtons isScrolled={true} />

            {/* Mobile: Search icon only, Desktop: Full search */}
            <div className="flex-1 max-w-md flex justify-end">
              <div className="md:hidden">
                <ResponsiveSearchBar
                  onSearch={onSearch}
                  isLoading={isLoadingPodcasts || isLoadingEpisodes}
                  placeholder={t('search.placeholder')}
                  enableInstantSearch={false}
                  initialValue={searchQuery}
                  isCompact={true}
                  onSearchStateChange={handleMobileSearchStateChange}
                />
              </div>
              <div className="hidden md:block">
                <ResponsiveSearchBar
                  onSearch={onSearch}
                  isLoading={isLoadingPodcasts || isLoadingEpisodes}
                  placeholder={t('search.placeholder')}
                  enableInstantSearch={false}
                  initialValue={searchQuery}
                  isCompact={true}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-24"></div>

      {/* Mobile search overlay when expanded */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-60 bg-background/95 backdrop-blur-md md:hidden">
          <div className="p-4 pt-20">
            <ResponsiveSearchBar
              onSearch={onSearch}
              isLoading={isLoadingPodcasts || isLoadingEpisodes}
              placeholder={t('search.placeholder')}
              enableInstantSearch={false}
              initialValue={searchQuery}
              isCompact={true}
              onSearchStateChange={handleMobileSearchStateChange}
            />
          </div>
        </div>
      )}
    </>
  );
}