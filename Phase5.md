# ♿ Phase 5: Accessibility - WCAG AA Compliance

## 📌 Overview

**Duration:** 2 Days  
**Goal:** Achieve WCAG AA compliance with full keyboard navigation, screen reader support, and accessible UI components.

---

## 🎯 Core Objectives

| Objective | Description | Priority |
|-----------|-------------|----------|
| **WCAG AA Compliance** | 4.5:1 contrast, semantic HTML | 🔴 Critical |
| **Keyboard Navigation** | Full app usability via keyboard | 🔴 Critical |
| **Screen Reader Support** | Proper ARIA labels & landmarks | 🟡 High |
| **Focus Management** | Visible focus indicators | 🟢 Medium |

---

## 📂 File Structure

```bash
app/
└── layout.tsx                 # Add skip link & landmarks (UPDATED)

components/
├── SkipToContent.tsx          # Skip navigation component (NEW)
├── Header.tsx                 # Accessible navigation (UPDATED)
├── MovieCard.tsx              # Keyboard + ARIA support (UPDATED)
└── SearchBar.tsx              # Accessible search input (UPDATED)

lib/
└── utils/
    └── a11y.ts                # Accessibility utilities (NEW)
```

---

## 🛠️ STEP 1: Skip-to-Content Link (30 min)

### Purpose
Allow keyboard users to bypass navigation and jump directly to main content.

### 1.1 - Create Skip Link Component

```tsx
// components/SkipToContent.tsx
'use client';

export function SkipToContent() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    mainContent?.focus();
    mainContent?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-red-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black transition-all"
    >
      Skip to main content
    </a>
  );
}
```

### 1.2 - Add Screen Reader Utility Classes

```css
/* app/globals.css - Add after Tailwind directives */

/* Screen reader only - Hidden visually but available to assistive tech */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Remove sr-only on focus */
.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### 1.3 - Update Root Layout

```tsx
// app/layout.tsx
import { SkipToContent } from '@/components/SkipToContent';
import { Header } from '@/components/Header';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black text-gray-100 antialiased">
        <SkipToContent />
        
        <Header />
        
        <main 
          id="main-content" 
          tabIndex={-1}
          className="min-h-screen pt-20 px-4 focus:outline-none"
        >
          {children}
        </main>
        
        <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-400 text-sm">
          <p>© 2024 Movies App. Powered by TMDB API.</p>
        </footer>
      </body>
    </html>
  );
}
```

**Key Improvements:**
- ✅ Skip link with smooth scroll animation
- ✅ Main content is focusable with `tabIndex={-1}`
- ✅ Semantic `<footer>` for better structure
- ✅ Focus management for better UX

---

## 🛠️ STEP 2: Accessible Header & Navigation (45 min)

### Purpose
Provide clear navigation structure with proper ARIA labels and keyboard support.

### 2.1 - Enhanced Header Component

```tsx
// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Search, Home } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  return (
    <header 
      className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-black via-black/95 to-black/80 backdrop-blur-md border-b border-gray-800"
      role="banner"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-red-600 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg px-2 py-1"
            aria-label="Movies App - Home"
          >
            <Film className="w-7 h-7" aria-hidden="true" />
            <span>Movies</span>
          </Link>

          {/* Navigation */}
          <nav 
            aria-label="Main navigation"
            className="flex items-center gap-2"
          >
            <NavLink 
              href="/" 
              icon={<Home className="w-4 h-4" />}
              isActive={pathname === '/'}
            >
              Home
            </NavLink>
            
            <NavLink 
              href="/search" 
              icon={<Search className="w-4 h-4" />}
              isActive={pathname === '/search'}
            >
              Search
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Navigation Link Component
interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ href, icon, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black
        ${isActive 
          ? 'bg-red-600 text-white' 
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }
      `}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
```

**Key Improvements:**
- ✅ `role="banner"` for semantic header
- ✅ `aria-label` for clear navigation purpose
- ✅ `aria-current="page"` for active link indication
- ✅ Icons marked with `aria-hidden="true"`
- ✅ Visible focus rings on all interactive elements
- ✅ Visual active state for current page

---

## 🛠️ STEP 3: Accessible Movie Card (60 min)

### Purpose
Make movie cards fully keyboard-accessible with proper ARIA attributes and descriptions.

### 3.1 - Create Accessibility Utilities

```typescript
// lib/utils/a11y.ts

/**
 * Formats movie information for screen readers
 */
export function getMovieAriaLabel(movie: {
  title: string;
  release_date?: string;
  vote_average: number;
}): string {
  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'Unknown year';
  
  const rating = movie.vote_average.toFixed(1);
  
  return `${movie.title}, released in ${year}, rating ${rating} out of 10`;
}

/**
 * Formats rating for screen readers
 */
export function getRatingAriaLabel(rating: number): string {
  return `Rated ${rating.toFixed(1)} out of 10 stars`;
}

/**
 * Handles keyboard events for interactive elements
 */
export function handleKeyboardClick(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}
```

### 3.2 - Enhanced Movie Card Component

```tsx
// components/MovieCard.tsx
'use client';

import Image from 'next/image';
import { Star, Calendar } from 'lucide-react';
import type { Movie } from '@/types/tmdb';
import { getPosterURL } from '@/lib/tmdb/config';
import { getMovieAriaLabel, handleKeyboardClick } from '@/lib/utils/a11y';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (id: number) => void;
  priority?: boolean; // For above-the-fold images
}

export function MovieCard({ movie, onSelect, priority = false }: MovieCardProps) {
  const posterURL = getPosterURL(movie.poster_path, 'medium');
  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';
  const rating = movie.vote_average.toFixed(1);

  const handleClick = () => {
    onSelect?.(movie.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    handleKeyboardClick(event, handleClick);
  };

  return (
    <article
      className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-black"
      aria-label={getMovieAriaLabel(movie)}
    >
      {/* Clickable Overlay */}
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
        aria-label={`View details for ${movie.title}`}
      >
        <span className="sr-only">
          {getMovieAriaLabel(movie)}
        </span>
      </button>

      {/* Poster Image */}
      <div className="relative aspect-[2/3] bg-gray-800">
        {posterURL ? (
          <Image
            src={posterURL}
            alt={`Movie poster for ${movie.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <span className="text-sm">No Image Available</span>
          </div>
        )}
      </div>

      {/* Info Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="text-white font-bold text-lg line-clamp-2">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
              <span>{rating}</span>
            </span>
            
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>{year}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
```

**Key Improvements:**
- ✅ Proper `<article>` semantic element
- ✅ Comprehensive `aria-label` with movie info
- ✅ Keyboard activation with Enter/Space
- ✅ Focus ring on the entire card
- ✅ Screen reader text with `.sr-only`
- ✅ Decorative info marked with `aria-hidden="true"`
- ✅ Priority loading for above-the-fold images

---

## 🛠️ STEP 4: Accessible Search Component (45 min)

### Purpose
Create a fully accessible search experience with proper labeling and feedback.

### 4.1 - Enhanced Search Bar

```tsx
// components/SearchBar.tsx
'use client';

import { useState, useId } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = 'Search movies...' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const searchId = useId();
  const resultsId = useId();

  // Trigger search on debounced value
  React.useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor={searchId} className="sr-only">
        Search for movies by title
      </label>
      
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search 
            className="w-5 h-5 text-gray-400" 
            aria-hidden="true" 
          />
        </div>

        {/* Search Input */}
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search movies"
          aria-controls={resultsId}
          aria-describedby={`${searchId}-help`}
          className="w-full pl-12 pr-12 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Screen Reader Helper Text */}
      <p id={`${searchId}-help`} className="sr-only">
        Type to search for movies. Results will appear below as you type.
      </p>

      {/* Results Container (for ARIA relationship) */}
      <div 
        id={resultsId} 
        role="region" 
        aria-live="polite" 
        aria-label="Search results"
        className="sr-only"
      >
        {query && `Searching for "${query}"...`}
      </div>
    </div>
  );
}
```

**Key Improvements:**
- ✅ Unique IDs using `useId()` hook
- ✅ Visible and hidden labels for screen readers
- ✅ `aria-controls` linking input to results
- ✅ `aria-describedby` for helper text
- ✅ Clear button with proper aria-label
- ✅ Live region for search status updates
- ✅ Proper focus management

---

## 🛠️ STEP 5: Focus Management & Styles (30 min)

### Purpose
Ensure all interactive elements have visible, consistent focus indicators.

### 5.1 - Global Focus Styles

```css
/* app/globals.css - Add after utilities */

/* Enhanced focus styles for better visibility */
*:focus-visible {
  outline: 2px solid theme('colors.red.500');
  outline-offset: 2px;
}

/* Button focus styles */
button:focus-visible,
a:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px theme('colors.black'),
              0 0 0 4px theme('colors.red.500');
}

/* Input focus styles */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none;
  border-color: theme('colors.red.500');
  box-shadow: 0 0 0 4px theme('colors.red.500/20');
}

/* Remove focus on mouse click (keep for keyboard) */
*:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}
```

### 5.2 - Focus Trap Utility (Optional for Modals)

```tsx
// components/FocusTrap.tsx
'use client';

import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
```

---

## 🧪 STEP 6: Accessibility Testing (60 min)

### 6.1 - Keyboard Navigation Checklist

Test the following keyboard navigation flow:

```bash
1. Press Tab from page load
   ✓ Skip link appears and is focused
   
2. Press Enter on skip link
   ✓ Main content receives focus
   
3. Press Tab multiple times
   ✓ Focus moves to: Logo → Nav links → Search input → Movie cards
   
4. On a movie card, press Enter or Space
   ✓ Movie details open/action triggers
   
5. Press Shift + Tab
   ✓ Focus moves backward through elements
   
6. Press Esc (if modal is open)
   ✓ Modal closes, focus returns to trigger element
```

### 6.2 - Lighthouse Accessibility Audit

```bash
# Run Lighthouse from command line
npx lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --output=json \
  --output-path=./lighthouse-a11y.json

# Or use Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Accessibility" only
# 4. Click "Generate report"
# 
# Target Score: ≥ 95
```

### 6.3 - axe DevTools Testing

```bash
# Install axe DevTools extension for Chrome/Firefox
# https://www.deque.com/axe/devtools/

# Test checklist:
✓ No critical violations
✓ No serious violations
✓ Review and fix moderate/minor issues
✓ Test on multiple pages: /, /search, /movie/[id]
```

### 6.4 - Screen Reader Testing

**NVDA (Windows) / VoiceOver (Mac)**

```bash
Test Flow:
1. Navigate with screen reader on
2. Check header announcements
3. Verify movie card descriptions
4. Test search input feedback
5. Confirm skip link functionality
6. Check form labels and errors
```

---

## 📊 Phase 5 Completion Checklist

### Day 1 ✅
- [ ] Implement skip-to-content link
- [ ] Add semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Create accessible navigation with ARIA labels
- [ ] Add screen reader utilities (`.sr-only`)

### Day 2 ✅
- [ ] Make MovieCard keyboard-accessible
- [ ] Enhance SearchBar with proper ARIA attributes
- [ ] Implement visible focus styles
- [ ] Run Lighthouse accessibility audit (score ≥ 95)
- [ ] Test with axe DevTools (no critical issues)
- [ ] Perform keyboard navigation testing
- [ ] Optional: Screen reader testing

---

## 🎯 Expected Results

After completing Phase 5:

✅ **WCAG AA Compliant** - Passes contrast ratios, semantic structure  
✅ **Keyboard Accessible** - All features usable without a mouse  
✅ **Screen Reader Friendly** - Clear announcements and labels  
✅ **Focus Management** - Visible, consistent focus indicators  
✅ **Lighthouse Score** - 95+ on Accessibility  
✅ **Zero Critical Issues** - Clean axe DevTools report  

---

## 🔗 Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 💡 Pro Tips

1. **Test Early, Test Often** - Don't wait until the end to test accessibility
2. **Use Semantic HTML** - It provides built-in accessibility features
3. **Never Remove Focus Outlines** - Use `:focus-visible` instead
4. **Test with Real Users** - Nothing beats actual feedback from users with disabilities
5. **Automate Testing** - Add axe-core to your CI/CD pipeline

---

**Phase 5 Complete!** 🎉

Your app is now accessible to all users, regardless of their abilities or the assistive technologies they use.