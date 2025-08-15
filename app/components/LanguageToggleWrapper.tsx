'use client';

import { useState, useEffect } from 'react';
import { LanguageToggle } from './LanguageToggle';
import { cn } from '@/app/lib/utils';

interface LanguageToggleWrapperProps {
  className?: string;
}

export function LanguageToggleWrapper({ className }: LanguageToggleWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show skeleton until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn(
        "h-10 px-4 rounded-full bg-secondary/20 animate-pulse",
        className
      )} />
    );
  }

  return <LanguageToggle className={className} />;
}