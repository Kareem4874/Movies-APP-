# ⚡ Phase 4: Performance & Quality (Next.js 16) – PWA, Bundles & CI/CD

## 📌 Overview

**Duration:** 2 Days  
**Goal:** Optimize the app for **high performance and production quality** on Next.js 16 with PWA support, smaller bundles, and CI/CD.

---

## 🎯 Main Objectives

| Objective | Description | Priority |
|-----------|-------------|----------|
| **Lighthouse ≥ 95** | Great scores in Performance, Best Practices, SEO | 🔴 Critical |
| **PWA Support** | `manifest.json` + Service Worker + offline basic | 🔴 Critical |
| **Bundle Optimization** | Dynamic imports, `next/image`, caching | 🟡 High |
| **CI/CD** | GitHub Actions pipeline (lint + type-check + build) | 🟢 Medium |

---

## 📅 Day-by-Day Breakdown

### **Day 1: PWA & Offline**
- ✅ Create `manifest.json`.  
- ✅ Create `sw.js` and offline page.  
- ✅ Register service worker.

### **Day 2: Bundles & CI/CD**
- ✅ Dynamic import heavy components (Trailer, Filters…).  
- ✅ Ensure images use `next/image` correctly.  
- ✅ Setup GitHub Actions workflow for CI.

---

## 🗂️ Files You Will Create / Update

```bash
public/
├── manifest.json              # PWA manifest (NEW)
├── sw.js                      # Service Worker (NEW)
├── offline.html               # Offline fallback page (NEW)
└── icons/
    ├── icon-192.png           # PWA icon 192x192 (NEW)
    └── icon-512.png           # PWA icon 512x512 (NEW)

app/
└── layout.tsx                 # Link manifest & register SW (UPDATED)

.github/
└── workflows/
    └── ci.yml                 # CI/CD pipeline (NEW)
```

---

## STEP 1: PWA Manifest – 30 min

**Purpose:** Allow install / Add to Home Screen with app metadata.

### 1.1 – Create `public/manifest.json`

```json
{
  "name": "Movies App – Next.js 16",
  "short_name": "Movies",
  "description": "TMDB-powered movies discovery app.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#e50914",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 1.2 – Link Manifest in `layout.tsx`

```tsx
// app/layout.tsx (داخل <head>)

<head>
  {/* existing script + meta */}
  <link rel="manifest" href="/manifest.json" />
  <link rel="icon" href="/icons/icon-192.png" />
  <meta name="theme-color" content="#000000" />
</head>
```

---

## STEP 2: Service Worker & Offline Page – 60 min

**Purpose:** Basic offline experience when the user is disconnected.

### 2.1 – Create `public/offline.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Offline – Movies App</title>
    <style>
      body {
        background: #000;
        color: #fff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        text-align: center;
        padding: 1rem;
      }
      a {
        color: #e50914;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>You are offline</h1>
      <p>Please check your internet connection and try again.</p>
      <p><a href="/">Go back home</a></p>
    </div>
  </body>
</html>
```

### 2.2 – Create `public/sw.js`

```js
// public/sw.js
const CACHE_NAME = 'movies-app-v1';
const urlsToCache = ['/', '/offline'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/offline');
        }
      });
    }),
  );
});
```

### 2.3 – Register the Service Worker (client component)

```tsx
// components/ServiceWorkerRegister.tsx
'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('SW registration failed:', err);
      });
    }
  }, []);

  return null;
}
```

ثم استدعِه في `layout.tsx` داخل `<body>`:

```tsx
// app/layout.tsx (داخل body)
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

<body>
  <Header />
  <ServiceWorkerRegister />
  <main className="min-h-screen pt-16">{children}</main>
</body>
```

> This is fully compatible with **Next.js 16** – the SW is static in `public/`.

---

## STEP 3: Bundle Optimization – 45–60 min

**Purpose:** Reduce initial JS payload using dynamic imports and good image practices.

### 3.1 – Dynamic Imports for Heavy Components

```tsx
// مثال: تحميل Trailer ديناميكيًا في صفحة تفاصيل الفيلم
import dynamic from 'next/dynamic';

const Trailer = dynamic(() => import('@/components/Trailer'), {
  loading: () => (
    <div className="aspect-video rounded-xl bg-gray-900 animate-pulse" />
  ),
  ssr: false,
});

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  // ... fetch movie + video key using server components

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Movie details ... */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Trailer</h2>
        <Trailer videoId={videoKey} title={movie.title} />
      </section>
    </main>
  );
}
```

### 3.2 – Ensure `next/image` for Posters & Backdrops

```tsx
// Example from MovieCard
<Image
  src={posterURL}
  alt={`${movie.title} poster`}
  fill
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
  priority={index < 6}
  className="object-cover"
/>
```

### 3.3 – Caching with `fetch` in Server Components

```tsx
// lib/tmdb/movies.ts (مثال مبسط)

export async function getPopularMovies() {
  const res = await fetch(`${process.env.TMDB_API_BASE_URL}/movie/popular`, {
    // عبر proxy الحقيقي في Phase 1 تستخدم /api/tmdb/movie/popular بدلاً من URL مباشر
    next: { revalidate: 60 * 60 }, // 1 hour
  });

  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
}
```

> `next: { revalidate }` ما زال الأسلوب الحديث في Next.js 16 للتحكم في caching.

---

## STEP 4: CI/CD with GitHub Actions – 45 min

**Purpose:** Ensure every push to `main` passes lint, type-check, and build.

### 4.1 – Create `.github/workflows/ci.yml`

```yaml
name: CI – Movies App

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build
        env:
          TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
          TMDB_API_BASE_URL: 'https://api.themoviedb.org/3'
```

> يمكنك إضافة خطوة Lighthouse CI لاحقًا لو أردت قياس الأداء أوتوماتيكيًا لكل deploy.

---

## STEP 5: Performance Verification – 30–45 min

### 5.1 – Production Build & Lighthouse

```bash
npm run build
npm run start
# افتح http://localhost:3000
```

ثم من Chrome DevTools → Lighthouse:

- حلّل `/` و `/search` و صفحة تفاصيل فيلم.  
- استهدف:  
  - **Performance** ≥ 95  
  - **Best Practices** ≥ 95  
  - **SEO** ≥ 95

### 5.2 – Network & Bundle Inspection

- استخدم تبويب Network لمراقبة:  
  - حجم JS المرسل في first load.  
  - الـ caching headers.  
- استخدم Performance tab للتأكد من عدم وجود long tasks كبيرة.

---

## 📊 Phase 4 Completion Checklist

### Day 1 ✅
- [ ] Create `manifest.json` and app icons.  
- [ ] Create `offline.html` and `sw.js`.  
- [ ] Register the Service Worker in the app.

### Day 2 ✅
- [ ] Apply dynamic imports to heavy components (Trailer, Filters…).  
- [ ] Verify `next/image` usage across the app.  
- [ ] Add GitHub Actions workflow (`ci.yml`).  
- [ ] Run Lighthouse locally and check scores.

---

## 🎯 Expected Results

بعد اكتمال **Phase 4**:

- التطبيق يعمل كـ **PWA** مع دعم basic offline.  
- الـ bundles الأساسية أصغر بفضل dynamic imports.  
- كل push إلى `main` يُفحَص تلقائيًا (lint + type-check + build).  
- أداء التطبيق ممتاز ومتوافق مع معايير Lighthouse على **Next.js 16**.
