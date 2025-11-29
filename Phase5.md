# ♿ Phase 5: Accessibility (Next.js 16) – WCAG AA & Keyboard Navigation

## 📌 Overview

**Duration:** 2 Days  
**Goal:** Make the Movies App accessible to all users by meeting **WCAG AA** guidelines with proper semantics, keyboard support, and screen reader–friendly components.

---

## 🎯 Main Objectives

| Objective | Description | Priority |
|-----------|-------------|----------|
| **WCAG AA** | Proper contrast, text, semantics | 🔴 Critical |
| **Keyboard Navigation** | Full app usable via keyboard only | 🔴 Critical |
| **Screen Reader Support** | ARIA attributes & landmarks | 🟡 High |
| **Focus Management** | Clear, visible focus states | 🟢 Medium |

---

## 📅 Day-by-Day Breakdown

### **Day 1: Semantics & Skip Links**
- ✅ Add skip-to-content link.  
- ✅ Ensure `<header>`, `<nav>`, `<main>`, `<footer>` usage.  
- ✅ Add ARIA labels to main navigation.

### **Day 2: Keyboard & Focus**
- ✅ Make movie cards and buttons fully keyboard-friendly.  
- ✅ Improve focus styles.  
- ✅ Run accessibility audits (Lighthouse, axe).

---

## 🗂️ Files You Will Create / Update

```bash
app/
└── layout.tsx                 # Add main landmarks & skip link (UPDATED)

components/
├── SkipToContent.tsx          # Skip link component (NEW)
├── Header.tsx                 # ARIA labels & semantics (UPDATED)
└── MovieCard.tsx              # Keyboard + ARIA improvements (UPDATED)
```

---

## STEP 1: Skip-to-Content Link – 30 min

**Purpose:** Allow keyboard users to jump directly to the main content.

### 1.1 – Create `SkipToContent.tsx`

```tsx
// components/SkipToContent.tsx
'use client';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded focus:outline-none"
    >
      Skip to main content
    </a>
  );
}
```

### 1.2 – Add `.sr-only` Utility in `globals.css`

```css
/* app/globals.css */
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
```

### 1.3 – Integrate in `layout.tsx`

```tsx
// app/layout.tsx (داخل body)

import { SkipToContent } from '@/components/SkipToContent';
import { Header } from '@/components/Header';

<body className="bg-black text-gray-100">
  <SkipToContent />
  <Header />
  <main id="main-content" className="min-h-screen pt-16">
    {children}
  </main>
</body>
```

> This pattern is fully compatible with **Next.js 16 App Router**.

---

## STEP 2: Semantic Header & Navigation – 30 min

**Purpose:** Provide clear structure and labels for screen readers.

### 2.1 – Update `Header.tsx`

```tsx
// components/Header.tsx (أضف ARIA semantics)

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <a
          href="/"
          className="text-2xl font-bold text-red-600 tracking-tight"
          aria-label="Movies App home"
        >
          Movies
        </a>

        <nav
          className="flex items-center gap-4 text-sm text-gray-200"
          aria-label="Primary navigation"
        >
          <a href="/" className="hover:text-white">
            Home
          </a>
          <a href="/search" className="hover:text-white">
            Search
          </a>
        </nav>
      </div>
    </header>
  );
}
```

---

## STEP 3: Accessible MovieCard – 45 min

**Purpose:** Make movie cards keyboard-activatable and descriptive for screen readers.

### 3.1 – Update `MovieCard.tsx`

```tsx
// components/MovieCard.tsx (مقتطف لتحسين الـ accessibility)

import Image from 'next/image';
import type { Movie } from '@/types/tmdb';
import { getPosterURL } from '@/lib/tmdb/config';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (id: number) => void; // optional callback
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  const posterURL = getPosterURL(movie.poster_path, 'medium');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  const label = `${movie.title}, released ${year}, rated ${movie.vote_average.toFixed(
    1,
  )} out of 10`;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(movie.id);
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={label}
      onKeyDown={handleKeyDown}
      onClick={() => onSelect?.(movie.id)}
      className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {posterURL ? (
        <Image
          src={posterURL}
          alt={`Poster for ${movie.title}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No Image
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-3" aria-hidden="true">
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-gray-300 text-xs mt-1">
            ⭐ {movie.vote_average.toFixed(1)} • {year}
          </p>
        </div>
      </div>
    </article>
  );
}
```

> يمكن استخدام `onSelect` لفتح صفحة تفاصيل الفيلم أو modal، مع الحفاظ على نفس سلوك الكيبورد.

---

## STEP 4: Focus Styles & Keyboard Testing – 45 min

**Purpose:** Ensure every interactive element has a visible focus outline and works with keyboard.

### 4.1 – Focus Styles in Buttons & Links

```tsx
<button
  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
>
  Play
</button>
```

### 4.2 – Keyboard Testing Checklist

1. من بداية الصفحة، استخدم `Tab` فقط:  
   - الترتيب: Skip link → Logo → Nav links → Search input → Filters → Movie cards.  
2. استخدم `Shift + Tab` للعودة للخلف.  
3. اضغط `Enter` أو `Space` على MovieCard:  
   - يجب أن تفتح صفحة تفاصيل الفيلم أو تستدعي `onSelect`.  
4. تأكد أن التريلر يمكن الوصول إليه بالكيبورد (الزر الذي يفتح iframe).  
5. تحقق أن الـ focus واضح على كل الروابط والأزرار.

---

## STEP 5: Accessibility Audit – 30 min

### 5.1 – Lighthouse (Accessibility Tab)

- افتح DevTools → Lighthouse → اختر **Accessibility**.  
- حلّل الصفحات: `/`, `/search`, صفحة تفاصيل فيلم.  
- استهدف درجة **≥ 95**.

### 5.2 – axe أو WAVE

- استخدم إضافة مثل **axe DevTools**:  
  - أصلح التحذيرات المتعلقة بـ:  
    - ARIA roles غير صالحة.  
    - `alt` المفقود في الصور.  
    - contrast منخفض.

---

## 📊 Phase 5 Completion Checklist

### Day 1 ✅
- [ ] إنشاء `SkipToContent` وإضافته في `layout.tsx`.  
- [ ] التأكد من استخدام `<header>`, `<nav>`, `<main>` بشكل صحيح.  
- [ ] إضافة ARIA labels للـ navigation.

### Day 2 ✅
- [ ] جعل `MovieCard` قابلة للتفاعل عبر الكيبورد (Enter/Space).  
- [ ] إضافة focus styles مرئية لكل الأزرار والروابط.  
- [ ] تشغيل Lighthouse/axe وتحقيق درجة عالية في Accessibility.

---

## 🎯 Expected Results

بعد الانتهاء من **Phase 5**:

- يمكن لأي مستخدم تصفح التطبيق باستخدام الكيبورد فقط.  
- قارئات الشاشة تحصل على معلومات واضحة عن الأفلام والعناصر التفاعلية.  
- الألوان والـ contrast متوافقان مع **WCAG AA**.  
- تقارير Lighthouse/axe نظيفة تقريبًا من مشاكل الوصولية، وكل ذلك ضمن مشروع يعمل على **Next.js 16 App Router**.
