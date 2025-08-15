'use client';

import { cn } from '@/app/lib/utils';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  const { t } = useLanguage();
  
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="mb-4">
        <svg 
          className="mx-auto h-12 w-12 text-destructive" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.132 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      <h3 className="heading-sm mb-2 text-destructive">{t('error.unexpected')}</h3>
      <p className="body-md text-muted-foreground mb-4 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "clean-button",
            "px-6 py-2",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90"
          )}
        >
          {t('error.retry')}
        </button>
      )}
    </div>
  );
}