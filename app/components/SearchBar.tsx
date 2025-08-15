'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { cn, debounce } from '@/app/lib/utils';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  enableInstantSearch?: boolean;
  initialValue?: string;
}

export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder,
  className,
  enableInstantSearch = true,
  initialValue = ''
}: SearchBarProps) {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState(initialValue);
  const debouncedSearchRef = useRef<ReturnType<typeof debounce>>();
  
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
    }, 300); // 300ms delay

    return () => {
      // Cleanup on unmount
      if (debouncedSearchRef.current) {
        // Cancel any pending debounced calls
      }
    };
  }, [onSearch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      // Cancel debounced search and execute immediately
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Trigger instant search if enabled and query is long enough
    if (enableInstantSearch && debouncedSearchRef.current) {
      debouncedSearchRef.current(newQuery);
    }
  };

  const handleClear = () => {
    setQuery('');
    // Optionally clear results when clearing search
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <div className={cn(
          "absolute inset-y-0 flex items-center pointer-events-none",
          isRTL ? "right-0 pr-4" : "left-0 pl-4"
        )}>
          {/* <svg
            className="h-5 w-5 text-muted-foreground"
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
          </svg> */}
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={defaultPlaceholder}
          disabled={isLoading}
          className={cn(
            "clean-input",
            "h-14 text-lg",
            isRTL ? "pr-6 pl-32" : "pl-6 pr-32",
            "focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-sm"
          )}
        />

        <div className={cn(
          "absolute inset-y-0 flex items-center",
          isRTL ? "left-0" : "right-0"
        )}>
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "p-2 hover:opacity-70 transition-opacity",
                isRTL ? "ml-3" : "mr-3"
              )}
              aria-label={t('search.clear')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--foreground)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              "h-10 px-6",
              isRTL ? "ml-3" : "mr-3",
              "bg-transparent border-none",
              "hover:opacity-70",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "transition-opacity duration-300",
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
                {t('search.searching')}
              </div>
            ) : (
              t('search.button')
            )}
          </button>
        </div>
      </div>
    </form>
  );
}