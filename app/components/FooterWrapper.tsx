'use client';

import { useState, useEffect } from 'react';
import { Footer } from './Footer';
import { ThamanyahIcon } from './ThamanyahIcon';

export function FooterWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <footer className="bg-background border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start gap-1 flex-wrap ml-4 sm:ml-0">
            <p className="text-sm sm:text-base text-muted-foreground">
              Built with love by Osama Alrefay for{' '}
            </p>
            <a
              href="https://thmanyah.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
              <ThamanyahIcon
                width={100}
                height={100}
                className="text-muted-foreground sm:w-10 sm:h-10"
              />
            </a>
            <p className="text-sm sm:text-base text-muted-foreground">
              Assignment
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return <Footer />;
}