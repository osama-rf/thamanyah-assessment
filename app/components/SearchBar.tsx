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
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);
  
  const defaultPlaceholder = placeholder || t('search.placeholder');

  // Update query when initialValue changes
  useEffect(() => {
    if (initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue, query]);

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

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={defaultPlaceholder}
          disabled={isLoading}
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "clean-input",
            "h-14 text-lg",
            isRTL ? "pr-6 pl-16 text-right" : "pl-6 pr-16 text-left",
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

        </div>
      </div>
    </form>
  );
}