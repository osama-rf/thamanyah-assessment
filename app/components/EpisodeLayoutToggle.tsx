'use client';

import { ViewMode } from '@/app/types/podcast';
import { cn } from '@/app/lib/utils';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface EpisodeLayoutToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function EpisodeLayoutToggle({ viewMode, onViewModeChange }: EpisodeLayoutToggleProps) {
  const { t } = useLanguage();
  
  const viewModes: { mode: ViewMode; icon: React.ReactElement; label: string }[] = [
    {
      mode: 'grid',
      label: t('layout.grid'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
        </svg>
      )
    },
    {
      mode: 'list',
      label: t('layout.list'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
        </svg>
      )
    },
    {
      mode: 'horizontal',
      label: t('layout.horizontal'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 7h4v10H3V7zm6 0h4v10H9V7zm6 0h4v10h-4V7z"/>
        </svg>
      )
    },
    {
      mode: 'compact',
      label: t('layout.compact'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="inline-flex rounded-lg border border-border bg-background p-1">
      {viewModes.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewModeChange(mode)}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            viewMode === mode
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}