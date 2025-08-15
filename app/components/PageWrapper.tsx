'use client';

import { useState, useEffect } from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="flex-1">
        <div className="bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="h-12 skeleton rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 skeleton rounded w-full max-w-2xl mx-auto"></div>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="h-14 skeleton rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="h-8 skeleton rounded w-64 mx-auto mb-3"></div>
            <div className="h-6 skeleton rounded w-80 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}