'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/app/lib/utils';

interface ThemeToggleWrapperProps {
  className?: string;
}

export function ThemeToggleWrapper({ className }: ThemeToggleWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show skeleton until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn(
        "h-10 w-10 rounded-full bg-secondary/20 animate-pulse",
        className
      )} />
    );
  }

  return <ThemeToggle className={className} />;
}