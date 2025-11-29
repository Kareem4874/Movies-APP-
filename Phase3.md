# 🎨 Phase 3: Enhanced UX - Dark Mode, Trailers & Responsive UI

## 📌 Overview

**Duration:** 3 Days  
**Goal:** Enhance user experience with dark mode (no FOUC), lazy-loaded YouTube trailers, and responsive animated layouts.

---

## 🎯 Objectives

| Feature | Priority | Time |
|---------|----------|------|
| Dark Mode (No FOUC) | 🔴 Critical | Day 1 |
| Trailer Component | 🔴 Critical | Day 2 |
| Responsive Grid | 🟡 High | Day 3 |
| Micro-interactions | 🟢 Medium | Day 3 |

---

## 📁 Files Structure

```
app/
└── layout.tsx                 # Add dark mode script (UPDATE)

components/
├── ThemeToggle.tsx           # Theme switcher (NEW)
├── Header.tsx                # App header with nav (NEW)
├── Trailer.tsx               # YouTube player (NEW)
├── MovieCard.tsx             # Enhanced UI (UPDATE)
└── SkeletonGrid.tsx          # Shimmer effect (UPDATE)

app/globals.css               # Add shimmer animation (UPDATE)
```

---

## 🌙 Day 1: Dark Mode Implementation

### Step 1.1: Pre-Hydration Script (30 min)

**Purpose:** Load theme before React hydration to prevent white flash.

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'Netflix Frontend - Movie Discovery',
  description: 'Discover movies and TV shows powered by TMDB',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark Mode Script - Runs before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('netflix-storage');
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    const theme = parsed?.state?.theme || 'dark';
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  // Fallback to system preference
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
```

**Implementation Notes:**
- ✅ Script reads from `localStorage` before hydration
- ✅ Falls back to system preference if no stored theme
- ✅ Uses `suppressHydrationWarning` to avoid mismatch errors
- ✅ Smooth transition with `transition-colors`

---

### Step 1.2: ThemeToggle Component (45 min)

**Purpose:** Interactive button to switch between light/dark themes.

```tsx
// components/ThemeToggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme changes to DOM
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  // Prevent SSR mismatch
  if (!mounted) {
    return (
      <div className="w-24 h-10 rounded-lg bg-gray-800/50 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="
        group relative inline-flex items-center gap-2 
        px-4 py-2 rounded-lg
        bg-gray-800/80 dark:bg-gray-900/80
        text-gray-100 
        hover:bg-gray-700 dark:hover:bg-gray-800
        border border-gray-700 dark:border-gray-600
        transition-all duration-200
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-red-600 
        focus-visible:ring-offset-2 
        focus-visible:ring-offset-black
        text-sm font-medium
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-lg" aria-hidden="true">
        {isDark ? '🌙' : '☀️'}
      </span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
```

**Implementation Notes:**
- ✅ Prevents hydration mismatch with `mounted` state
- ✅ Shows skeleton loader during SSR
- ✅ Accessible with ARIA labels
- ✅ Smooth transitions and focus states

---

### Step 1.3: Header Component (45 min)

**Purpose:** Fixed header with logo, navigation, and theme toggle.

```tsx
// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="
      fixed top-0 inset-x-0 z-50
      bg-gradient-to-b from-black via-black/95 to-black/80
      backdrop-blur-sm
      border-b border-white/10
    ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link
            href="/"
            className="
              text-2xl sm:text-3xl font-bold 
              text-red-600 hover:text-red-500
              tracking-tight transition-colors
              focus-visible:outline-none 
              focus-visible:ring-2 
              focus-visible:ring-red-600 
              focus-visible:ring-offset-2 
              focus-visible:ring-offset-black
              rounded-sm
            "
            aria-label="Netflix Frontend - Home"
          >
            MOVIES
          </Link>

          {/* Navigation */}
          <nav 
            className="hidden sm:flex items-center gap-6 text-sm font-medium"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className={`
                transition-colors
                hover:text-white
                focus-visible:outline-none 
                focus-visible:ring-2 
                focus-visible:ring-red-600 
                focus-visible:ring-offset-2 
                focus-visible:ring-offset-black
                rounded-sm px-1
                ${isActive('/') ? 'text-white' : 'text-gray-300'}
              `}
            >
              Home
            </Link>
            <Link
              href="/search"
              className={`
                transition-colors
                hover:text-white
                focus-visible:outline-none 
                focus-visible:ring-2 
                focus-visible:ring-red-600 
                focus-visible:ring-offset-2 
                focus-visible:ring-offset-black
                rounded-sm px-1
                ${isActive('/search') ? 'text-white' : 'text-gray-300'}
              `}
            >
              Search
            </Link>
          </nav>

          {/* Theme Toggle */}
          <div className="ml-auto sm:ml-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
```

**Implementation Notes:**
- ✅ Fixed position with backdrop blur
- ✅ Active state for current route
- ✅ Responsive (hides nav on mobile)
- ✅ Accessible keyboard navigation

---

## 🎬 Day 2: Trailer Component

### Step 2.1: Lazy YouTube Trailer (60 min)

**Purpose:** Privacy-preserving trailer player with lazy loading.

```tsx
// components/Trailer.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TrailerProps {
  videoId: string;
  title: string;
  className?: string;
}

export function Trailer({ videoId, title, className = '' }: TrailerProps) {
  const [showIframe, setShowIframe] = useState(false);
  const [imageError, setImageError] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className={`aspect-video relative rounded-xl overflow-hidden bg-gray-900 ${className}`}>
      {!showIframe ? (
        <button
          type="button"
          onClick={() => setShowIframe(true)}
          className="w-full h-full relative group cursor-pointer"
          aria-label={`Play trailer for ${title}`}
        >
          {/* Thumbnail */}
          <Image
            src={imageError ? fallbackThumbnail : thumbnailUrl}
            alt={`${title} trailer thumbnail`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
            priority
          />

          {/* Overlay */}
          <div className="
            absolute inset-0 
            bg-gradient-to-t from-black/80 via-black/40 to-transparent
            group-hover:from-black/90 group-hover:via-black/60
            transition-all duration-300
            flex items-center justify-center
          ">
            {/* Play Button */}
            <div className="
              relative
              w-16 h-16 sm:w-20 sm:h-20
              rounded-full 
              bg-red-600/90 
              group-hover:bg-red-600
              group-hover:scale-110
              shadow-2xl
              flex items-center justify-center
              transition-all duration-300
              group-focus-visible:ring-4 
              group-focus-visible:ring-red-600/50
            ">
              {/* Play Icon */}
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <h3 className="text-white font-semibold text-sm sm:text-base drop-shadow-lg">
                Watch Trailer
              </h3>
            </div>
          </div>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={`${title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
}
```

**Implementation Notes:**
- ✅ Uses `youtube-nocookie.com` for privacy
- ✅ Lazy loads iframe on click
- ✅ Fallback for missing thumbnails
- ✅ Smooth hover animations
- ✅ Accessible with proper ARIA labels
- ✅ Responsive sizing

**Usage Example:**
```tsx
// app/movies/[id]/page.tsx
import { Trailer } from '@/components/Trailer';

export default function MoviePage() {
  const trailerKey = 'dQw4w9WgXcQ'; // From TMDB API
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Trailer 
        videoId={trailerKey} 
        title="Inception"
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}
```

---

## 📱 Day 3: Responsive Grid & Animations

### Step 3.1: Enhanced MovieCard (45 min)

**Purpose:** Polished movie card with smooth interactions.

```tsx
// components/MovieCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Movie } from '@/types/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  
  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';
  
  const rating = movie.vote_average.toFixed(1);

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="
        group block 
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-red-600 
        focus-visible:ring-offset-4 
        focus-visible:ring-offset-black
        rounded-lg
      "
    >
      <article className="
        relative 
        aspect-[2/3] 
        rounded-lg 
        overflow-hidden 
        bg-gray-900 
        cursor-pointer
        transition-all duration-300 ease-out
        group-hover:-translate-y-2
        group-hover:shadow-2xl
        group-hover:shadow-red-600/20
      ">
        {/* Poster Image */}
        {posterURL && !imageError ? (
          <Image
            src={posterURL}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            className="
              object-cover 
              group-hover:scale-110 
              transition-transform duration-500 ease-out
            "
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center p-4">
              <span className="text-4xl mb-2 block">🎬</span>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="
          absolute inset-0 
          bg-gradient-to-t from-black via-black/60 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        ">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Title */}
            <h3 className="
              text-white font-bold text-sm sm:text-base 
              line-clamp-2 mb-2
              drop-shadow-lg
            ">
              {movie.title}
            </h3>
            
            {/* Meta Info */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                {rating}
              </span>
              <span className="text-gray-500">•</span>
              <span>{year}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
```

**Implementation Notes:**
- ✅ Smooth hover lift effect
- ✅ Scale animation on image
- ✅ Gradient overlay with info
- ✅ Error handling for missing images
- ✅ Responsive text sizes
- ✅ Optimized image loading

---

### Step 3.2: Responsive MovieGrid (30 min)

**Purpose:** Adaptive grid layout for all screen sizes.

```tsx
// components/MovieGrid.tsx
import { MovieCard } from '@/components/MovieCard';
import type { Movie } from '@/types/tmdb';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
}

export function MovieGrid({ movies, title }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <section className="py-8">
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-gray-300">
            {title}
          </h2>
        )}
        <p className="text-gray-500 text-center py-12">
          No movies found
        </p>
      </section>
    );
  }

  return (
    <section className="py-8">
      {title && (
        <h2 className="
          text-2xl sm:text-3xl font-bold mb-6 
          text-gray-900 dark:text-white
          tracking-tight
        ">
          {title}
        </h2>
      )}
      
      <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6 
        gap-4 sm:gap-6
      ">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
```

**Breakpoints:**
- **Mobile:** 2 columns (< 640px)
- **Small:** 3 columns (640px - 768px)
- **Medium:** 4 columns (768px - 1024px)
- **Large:** 5 columns (1024px - 1280px)
- **XL:** 6 columns (> 1280px)

---

### Step 3.3: Shimmer Loading Effect (30 min)

**Purpose:** Elegant loading skeletons with animation.

```tsx
// components/SkeletonGrid.tsx
interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className="
      grid 
      grid-cols-2 
      sm:grid-cols-3 
      md:grid-cols-4 
      lg:grid-cols-5 
      xl:grid-cols-6 
      gap-4 sm:gap-6
      py-8
    ">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Card Skeleton */}
          <div className="
            aspect-[2/3] 
            rounded-lg 
            bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800
            bg-[length:200%_100%]
            animate-shimmer
          " />
          
          {/* Title Skeleton */}
          <div className="mt-3 h-4 bg-gray-800 rounded w-3/4" />
          
          {/* Meta Skeleton */}
          <div className="mt-2 h-3 bg-gray-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

**Add to `globals.css`:**
```css
/* app/globals.css */

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@layer utilities {
  .animate-shimmer {
    animation: shimmer 2s infinite linear;
  }
}
```

**Update `tailwind.config.ts`:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 🧪 Testing Checklist

### Dark Mode Testing
- [ ] Toggle between light/dark themes
- [ ] Refresh page - theme persists without flash
- [ ] Test system preference fallback
- [ ] Check all components in both themes

### Header Testing
- [ ] Fixed positioning works on scroll
- [ ] Navigation links are functional
- [ ] Active state shows correctly
- [ ] Responsive on mobile devices
- [ ] Focus states visible on keyboard navigation

### Trailer Testing
- [ ] Thumbnail loads correctly
- [ ] Click to play loads iframe
- [ ] Uses `youtube-nocookie.com` domain
- [ ] Fallback thumbnail works
- [ ] Hover effects smooth
- [ ] Accessible with keyboard

### Grid Testing
- [ ] Test on different screen sizes:
  - Mobile (320px - 640px): 2 columns
  - Tablet (640px - 1024px): 3-4 columns
  - Desktop (1024px+): 5-6 columns
- [ ] Hover effects work smoothly
- [ ] Focus states visible
- [ ] Images load with proper sizes
- [ ] Skeleton loading appears correctly

---

## 📊 Phase 3 Completion

### Day 1 ✅
- [x] Pre-hydration script in layout
- [x] ThemeToggle component
- [x] Header with navigation

### Day 2 ✅
- [x] Trailer component with lazy loading
- [x] YouTube no-cookie integration
- [x] Accessible player controls

### Day 3 ✅
- [x] Enhanced MovieCard with animations
- [x] Responsive MovieGrid layout
- [x] Shimmer loading effect
- [x] Visual QA across breakpoints

---

## 🎯 Success Criteria

After completing Phase 3:

✅ **Dark Mode:** Seamless switching without FOUC  
✅ **Performance:** No layout shifts or jank  
✅ **Accessibility:** Full keyboard navigation  
✅ **Responsive:** Perfect on all screen sizes  
✅ **Privacy:** YouTube no-cookie domain  
✅ **UX:** Netflix-quality feel and polish

---

## 🔄 Next Steps

Ready for **Phase 4: Performance & Quality**:
- Bundle optimization
- Lighthouse audit
- PWA implementation
- CI/CD pipeline

---

## 📚 Resources

- [Next.js 15 Dark Mode](https://nextjs.org/docs/app/building-your-application/styling/css-modules#dark-mode)
- [YouTube Privacy Policy](https://support.google.com/youtube/answer/171780)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)