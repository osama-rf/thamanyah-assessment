'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { cn, debounce } from '@/app/lib/utils';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface ResponsiveSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  enableInstantSearch?: boolean;
  initialValue?: string;
  isCompact?: boolean;
  onSearchStateChange?: (isOpen: boolean) => void;
}

export function ResponsiveSearchBar({
  onSearch,
  isLoading = false,
  placeholder,
  className,
  enableInstantSearch = true,
  initialValue = '',
  isCompact = false,
  onSearchStateChange
}: ResponsiveSearchBarProps) {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState(initialValue);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearchRef = useRef<ReturnType<typeof debounce>>();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const defaultPlaceholder = placeholder || t('search.placeholder');

  // Update query when initialValue changes
  useEffect(() => {
    if (initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Create debounced search function
  useEffect(() => {
    debouncedSearchRef.current = debounce((searchQuery: string) => {
      if (searchQuery.trim() && searchQuery.length >= 2) {
        onSearch(searchQuery.trim());
      }
    }, 300);

    return () => {
      if (debouncedSearchRef.current) {
        // Cleanup
      }
    };
  }, [onSearch]);

  // Handle search state changes
  useEffect(() => {
    onSearchStateChange?.(isSearchOpen);
  }, [isSearchOpen, onSearchStateChange]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      if (isCompact) {
        setIsSearchOpen(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (enableInstantSearch && debouncedSearchRef.current) {
      debouncedSearchRef.current(newQuery);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery('');
  };

  // Mobile search icon only (when compact and search is closed)
  if (isCompact && !isSearchOpen) {
    return (
      <button
        onClick={handleSearchIconClick}
        className="p-2 rounded-lg bg-transparent hover:bg-muted/20 transition-all duration-300 ease-out"
        aria-label={t('search.placeholder')}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    );
  }

  // Full search bar (desktop or mobile when open)
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        {/* Search icon removed when search bar is open */}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={defaultPlaceholder}
          disabled={isLoading}
          className={cn(
            "clean-input",
            isCompact ? "h-12 text-base" : "h-14 text-lg",
            isRTL ? "pr-6 pl-32" : "pl-6 pr-32",
            "focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-sm w-full"
          )}
        />

        <div className={cn(
          "absolute inset-y-0 flex items-center gap-1",
          isRTL ? "left-0" : "right-0"
        )}>
          {/* Close button for mobile search */}
          {isCompact && isSearchOpen && (
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "p-2 hover:opacity-70 transition-opacity duration-300 ease-out",
                isRTL ? "ml-2" : "mr-2"
              )}
              aria-label="Close search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--foreground)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Clear button */}
          {query && !isLoading && (!isCompact || !isSearchOpen) && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "p-2 hover:opacity-70 transition-opacity duration-300 ease-out",
                isRTL ? "ml-2" : "mr-2"
              )}
              aria-label={t('search.clear')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--foreground)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              isCompact ? "h-8 px-4 text-sm" : "h-10 px-6",
              isRTL ? "ml-3" : "mr-3",
              "bg-transparent border-none",
              "hover:opacity-70",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "transition-opacity duration-300 ease-out",
              "font-medium rounded-md"
            )}
            style={{ color: 'var(--foreground)' }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--foreground)' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isCompact ? '' : t('search.searching')}
              </div>
            ) : (
              isCompact ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--foreground)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ) : (
                t('search.button')
              )
            )}
          </button>
        </div>
      </div>
    </form>
  );
}