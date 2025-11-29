// components/ThemeToggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-lg
        bg-slate-200 dark:bg-slate-800
        hover:bg-slate-300 dark:hover:bg-slate-700
        transition-all duration-300
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-red-500 
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
        group
      "
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Sun Icon */}
      <Sun 
        className={`
          w-5 h-5 text-amber-500
          transition-all duration-300 absolute inset-2
          ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
        `}
      />
      
      {/* Moon Icon */}
      <Moon 
        className={`
          w-5 h-5 text-slate-300
          transition-all duration-300
          ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
        `}
      />
    </button>
  );
}