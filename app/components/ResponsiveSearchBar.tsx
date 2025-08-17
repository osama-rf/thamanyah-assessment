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
  onClear?: () => void;
}

export function ResponsiveSearchBar({
  onSearch,
  isLoading = false,
  placeholder,
  className,
  enableInstantSearch = true,
  initialValue = undefined,
  isCompact = false,
  onSearchStateChange,
  onClear
}: ResponsiveSearchBarProps) {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState(initialValue || '');
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevInitialValue = useRef(initialValue);
  
  const defaultPlaceholder = placeholder || t('search.placeholder');

  // Only update query when initialValue changes externally (not from user typing)
  useEffect(() => {
    if (initialValue !== prevInitialValue.current) {
      setQuery(initialValue || '');
      prevInitialValue.current = initialValue;
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
      // Don't close search bar on submit - only close with X button
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

  // X button clears input and calls onClear if provided
  const handleClose = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };


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
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "clean-input",
            isCompact ? "h-10 text-sm sm:h-12 sm:text-base" : "h-14 text-lg",
            isRTL ? "pr-0 pl-0 sm:pr-6 sm:pl-16 text-right" : "pl-3 pr-12 sm:pl-6 sm:pr-16 text-left",
            "focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-sm w-full min-w-0"
          )}
        />

        <div className={cn(
          "absolute inset-y-0 flex items-center gap-1",
          isRTL ? "left-0" : "right-0"
        )}>
          {/* Clear button (X) - only clears input text */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "p-1 sm:p-2 hover:opacity-70 transition-opacity duration-300 ease-out",
                isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"
              )}
              aria-label={t('search.clear')}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--foreground)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}


        </div>
      </div>
    </form>
  );
}