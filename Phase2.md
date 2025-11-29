# 🔍 Phase 2: Search & Filtering - Advanced Discovery Layer

## 📌 نظرة عامة (Overview)

**المدة:** 3 أيام  
**الهدف:** بناء نظام بحث وفلترة متقدم باستخدام Next.js 16 App Router مع Zustand للحالة العامة، البحث المتأخر (debouncing)، والتخزين المؤقت في المتصفح.

---

## 🎯 الأهداف الرئيسية

| الهدف | الوصف | الأولوية |
|-------|-------|----------|
| **صفحة البحث** | `/search` تستخدم TMDB search/discover endpoints | 🔴 حرج |
| **البحث المتأخر** | تأخير الطلبات أثناء كتابة المستخدم | 🔴 حرج |
| **نظام الفلاتر** | تصفية حسب النوع، السنة، التقييم، الترتيب | 🟡 عالي |
| **الحالة العامة (Zustand)** | إدارة مركزية للثيم والبحث والفلاتر | 🟡 عالي |
| **التخزين المؤقت** | حفظ النتائج في `localStorage` لتسريع التجربة | 🟢 متوسط |

> **ملاحظة:** هذه المرحلة تبني على **Phase 1** (طبقة البيانات الأساسية). نفترض أن TMDB proxy وجلب الأفلام الأساسي يعملان بشكل صحيح.

---

## 📅 التوزيع اليومي

### **اليوم الأول: الحالة العامة والـ Hooks**
- ✅ إنشاء Zustand store (`lib/store.ts`)
- ✅ تطبيق `useDebounce` hook
- ✅ تطبيق `useCachedData` hook

### **اليوم الثاني: واجهة البحث**
- ✅ بناء `SearchBar` component (مع debouncing)
- ✅ ربط استعلام البحث بالـ store العام
- ✅ إعداد استدعاء API البحث عبر الـ proxy

### **اليوم الثالث: الفلاتر والتكامل**
- ✅ بناء `Filters` component (نوع/سنة/تقييم/ترتيب)
- ✅ تطبيق `SearchResults` والتكامل مع TMDB discover API
- ✅ إنشاء صفحة `/search` وربط كل شيء معاً

---

## 🗂️ الملفات المطلوبة

```bash
app/
└── search/
    └── page.tsx              # صفحة نتائج البحث (جديد)

components/
├── SearchBar.tsx             # حقل البحث مع debouncing (جديد)
├── Filters.tsx               # عناصر التحكم بالفلاتر (جديد)
└── SearchResults.tsx         # شبكة الأفلام من نتائج البحث (جديد)

lib/
├── store.ts                  # Zustand store للثيم + البحث + الفلاتر (جديد)
└── url.ts                    # دوال مساعدة لبناء query params (جديد)

hooks/
├── useDebounce.ts            # Hook للتأخير (جديد)
└── useCachedData.ts          # Hook للتخزين المؤقت (جديد)
```

---

## 📦 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت المكتبات التالية:

```bash
npm install zustand
npm install lru-cache  # إذا لم تكن مثبتة من Phase 1
```

---

## STEP 1: الحالة العامة مع Zustand - 45 دقيقة

**الهدف:** مركزة الثيم، البحث، والفلاتر في store واحد مع الاستمرارية.

### 1.1 - إنشاء `lib/store.ts`

```typescript
// lib/store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// أنواع خيارات الترتيب
export type SortOption = 'popularity' | 'rating' | 'release_date';

// واجهة حالة الفلاتر
export interface FilterState {
  genre: number | null;          // معرف النوع من TMDB
  year: number | null;           // سنة الإصدار
  rating: number | null;         // الحد الأدنى للتقييم (vote_average)
  sortBy: SortOption;            // طريقة الترتيب
}

// واجهة الحالة العامة للتطبيق
interface AppState {
  // الحالة
  theme: 'light' | 'dark';
  searchQuery: string;
  filters: FilterState;

  // الإجراءات (Actions)
  setTheme: (theme: 'light' | 'dark') => void;
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

// القيم الافتراضية للفلاتر
const defaultFilters: FilterState = {
  genre: null,
  year: null,
  rating: null,
  sortBy: 'popularity',
};

// إنشاء الـ Store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // القيم الابتدائية
        theme: 'dark',
        searchQuery: '',
        filters: defaultFilters,

        // إجراء تغيير الثيم
        setTheme: (theme) => set({ theme }),

        // إجراء تحديث استعلام البحث
        setSearchQuery: (searchQuery) => set({ searchQuery }),

        // إجراء تحديث الفلاتر (جزئي)
        updateFilters: (partial) =>
          set((state) => ({
            filters: { ...state.filters, ...partial },
          })),

        // إجراء إعادة تعيين الفلاتر
        resetFilters: () => set({ filters: defaultFilters }),
      }),
      {
        name: 'netflix-app-storage', // اسم المفتاح في localStorage
      },
    ),
  ),
);
```

### 1.2 - Implementation مبسط للاختبار

أنشئ ملف اختبار بسيط:

```typescript
// test/store-test.tsx
'use client';

import { useAppStore } from '@/lib/store';

export function StoreTest() {
  const { theme, searchQuery, filters, setTheme, setSearchQuery, updateFilters, resetFilters } = useAppStore();

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold">Store Test</h2>
      
      {/* عرض الحالة الحالية */}
      <div className="space-y-2">
        <p>Theme: {theme}</p>
        <p>Search: {searchQuery}</p>
        <p>Genre: {filters.genre || 'null'}</p>
        <p>Year: {filters.year || 'null'}</p>
        <p>Rating: {filters.rating || 'null'}</p>
        <p>Sort: {filters.sortBy}</p>
      </div>

      {/* أزرار الاختبار */}
      <div className="space-x-2">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Toggle Theme
        </button>
        
        <button 
          onClick={() => setSearchQuery('Inception')}
          className="px-4 py-2 bg-green-600 rounded"
        >
          Set Search
        </button>
        
        <button 
          onClick={() => updateFilters({ genre: 28, year: 2020 })}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          Update Filters
        </button>
        
        <button 
          onClick={resetFilters}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
```

**كيفية الاختبار:**
1. أضف `<StoreTest />` إلى أي صفحة مؤقتة
2. جرب الأزرار وراقب التغييرات
3. أعد تحميل الصفحة - يجب أن تبقى الحالة محفوظة

---

## STEP 2: Hooks المساعدة - 60 دقيقة

### 2.1 - `useDebounce` Hook

**الهدف:** تأخير التحديثات لتقليل عدد الطلبات.

```typescript
// hooks/useDebounce.ts
'use client';

import { useEffect, useState } from 'react';

/**
 * Hook لتأخير القيمة لفترة معينة
 * مفيد للبحث لتجنب إرسال طلب مع كل حرف
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // إنشاء مؤقت للتأخير
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // إلغاء المؤقت عند تغيير القيمة
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
```

### 2.2 - `useCachedData` Hook

**الهدف:** تخزين النتائج في localStorage لتسريع التجربة.

```typescript
// hooks/useCachedData.ts
'use client';

import { useEffect, useState } from 'react';

// واجهة مدخل الـ Cache
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Hook لجلب البيانات مع التخزين المؤقت في localStorage
 * @param key مفتاح التخزين الفريد
 * @param fetcher دالة جلب البيانات
 * @param ttl مدة الصلاحية بالملي ثانية (افتراضي: ساعة)
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 1000 * 60 * 60, // ساعة واحدة
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // محاولة القراءة من الـ Cache أولاً
        if (typeof window !== 'undefined') {
          const raw = window.localStorage.getItem(key);
          
          if (raw) {
            const cached = JSON.parse(raw) as CacheEntry<T>;
            
            // التحقق من صلاحية الـ Cache
            if (cached.expiresAt > Date.now()) {
              if (!cancelled) {
                setData(cached.value);
                setLoading(false);
              }
              return; // استخدام البيانات المخزنة
            }
          }
        }

        // جلب بيانات جديدة
        const fresh = await fetcher();
        
        if (cancelled) return;

        setData(fresh);

        // حفظ في الـ Cache
        if (typeof window !== 'undefined') {
          const entry: CacheEntry<T> = {
            value: fresh,
            expiresAt: Date.now() + ttl,
          };
          window.localStorage.setItem(key, JSON.stringify(entry));
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    // تنظيف عند إلغاء التحميل
    return () => {
      cancelled = true;
    };
  }, [key, ttl]); // ملاحظة: fetcher غير مضاف للـ dependencies لتجنب re-fetching

  return { data, loading, error } as const;
}
```

### 2.3 - Implementation للاختبار

```typescript
// test/hooks-test.tsx
'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useCachedData } from '@/hooks/useCachedData';

export function HooksTest() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);

  const { data, loading, error } = useCachedData(
    'test-data',
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Hello from cache!', timestamp: Date.now() };
    },
    5000 // 5 ثوانٍ للاختبار
  );

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold">Hooks Test</h2>
      
      {/* اختبار Debounce */}
      <div>
        <p className="mb-2">Debounce Test:</p>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-2 bg-gray-800 rounded"
          placeholder="Type something..."
        />
        <p className="mt-2">
          <span className="text-gray-400">Immediate:</span> {input}
        </p>
        <p>
          <span className="text-gray-400">Debounced:</span> {debouncedInput}
        </p>
      </div>

      {/* اختبار Cache */}
      <div>
        <p className="mb-2">Cache Test:</p>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <div>
            <p>{data.message}</p>
            <p className="text-sm text-gray-400">
              Timestamp: {new Date(data.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## STEP 3: SearchBar Component - 45 دقيقة

**الهدف:** مكون واجهة لكتابة استعلامات البحث مع التأخير قبل التحديث.

### 3.1 - إنشاء `SearchBar.tsx`

```typescript
// components/SearchBar.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppStore } from '@/lib/store';

export function SearchBar() {
  // حالة محلية للـ input (تحديث فوري)
  const [input, setInput] = useState('');
  
  // قيمة متأخرة (تتحدث بعد 500ms من التوقف عن الكتابة)
  const debouncedInput = useDebounce(input, 500);
  
  // إجراء تحديث الـ store
  const { setSearchQuery } = useAppStore();

  // تحديث الـ store عند تغيير القيمة المتأخرة
  useEffect(() => {
    setSearchQuery(debouncedInput.trim());
  }, [debouncedInput, setSearchQuery]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ابحث عن أفلام أو مسلسلات..."
          className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-900/70 text-white placeholder:text-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
          aria-label="Search for movies or TV shows"
        />
        
        {/* أيقونة البحث */}
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {/* مؤشر للتأخير (اختياري) */}
      {input !== debouncedInput && (
        <p className="text-xs text-gray-500 mt-1 px-1">
          جاري البحث...
        </p>
      )}
    </div>
  );
}
```

### 3.2 - Implementation للاختبار

أنشئ صفحة اختبار بسيطة:

```typescript
// app/test-search/page.tsx
'use client';

import { SearchBar } from '@/components/SearchBar';
import { useAppStore } from '@/lib/store';

export default function TestSearchPage() {
  const { searchQuery } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">SearchBar Test</h1>
      
      <SearchBar />
      
      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400">Current search query in store:</p>
        <p className="text-xl text-white mt-2">
          {searchQuery || '(empty)'}
        </p>
      </div>
    </div>
  );
}
```

**كيفية الاختبار:**
1. افتح `/test-search`
2. ابدأ الكتابة - يجب أن ترى "جاري البحث..."
3. توقف عن الكتابة لمدة 500ms
4. يجب أن يتحدث النص أسفل الصفحة

---

## STEP 4: Filters Component - 60 دقيقة

**الهدف:** إضافة عناصر تحكم للنوع، السنة، التقييم، والترتيب.

### 4.1 - إنشاء `Filters.tsx`

```typescript
// components/Filters.tsx
'use client';

import { useAppStore } from '@/lib/store';

// واجهة النوع من TMDB
interface Genre {
  id: number;
  name: string;
}

interface FiltersProps {
  genres: Genre[];
}

export function Filters({ genres }: FiltersProps) {
  const { filters, updateFilters, resetFilters } = useAppStore();

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6 text-sm">
      {/* فلتر النوع */}
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label htmlFor="genre-filter" className="text-gray-300 font-medium">
          النوع
        </label>
        <select
          id="genre-filter"
          value={filters.genre ?? ''}
          onChange={(e) =>
            updateFilters({ 
              genre: e.target.value ? Number(e.target.value) : null 
            })
          }
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="">الكل</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* فلتر السنة */}
      <div className="flex flex-col gap-1">
        <label htmlFor="year-filter" className="text-gray-300 font-medium">
          السنة
        </label>
        <input
          id="year-filter"
          type="number"
          min={1900}
          max={new Date().getFullYear() + 1}
          value={filters.year ?? ''}
          onChange={(e) =>
            updateFilters({ 
              year: e.target.value ? Number(e.target.value) : null 
            })
          }
          placeholder="مثال: 2020"
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white w-28 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* فلتر التقييم */}
      <div className="flex flex-col gap-1">
        <label htmlFor="rating-filter" className="text-gray-300 font-medium">
          الحد الأدنى للتقييم
        </label>
        <input
          id="rating-filter"
          type="number"
          min={0}
          max={10}
          step={0.5}
          value={filters.rating ?? ''}
          onChange={(e) =>
            updateFilters({ 
              rating: e.target.value ? Number(e.target.value) : null 
            })
          }
          placeholder="مثال: 7.5"
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white w-24 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* فلتر الترتيب */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <label htmlFor="sort-filter" className="text-gray-300 font-medium">
          الترتيب حسب
        </label>
        <select
          id="sort-filter"
          value={filters.sortBy}
          onChange={(e) => 
            updateFilters({ sortBy: e.target.value as any })
          }
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="popularity">الشعبية</option>
          <option value="rating">التقييم</option>
          <option value="release_date">تاريخ الإصدار</option>
        </select>
      </div>

      {/* زر إعادة التعيين */}
      <button
        type="button"
        onClick={resetFilters}
        className="ml-auto px-4 py-2 rounded-lg bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
        aria-label="Reset filters"
      >
        إعادة تعيين
      </button>
    </div>
  );
}
```

### 4.2 - Implementation للاختبار

```typescript
// app/test-filters/page.tsx
import { Filters } from '@/components/Filters';

// genres وهمية للاختبار
const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
];

export default function TestFiltersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Filters Test</h1>
      
      <Filters genres={mockGenres} />
      
      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400">
          جرب تغيير الفلاتر وأعد تحميل الصفحة - يجب أن تبقى محفوظة
        </p>
      </div>
    </div>
  );
}
```

---

## STEP 5: SearchResults + صفحة `/search` - 60-90 دقيقة

### 5.1 - إنشاء دالة مساعدة `lib/url.ts`

```typescript
// lib/url.ts
import type { FilterState } from '@/lib/store';

/**
 * بناء query parameters لـ TMDB discover endpoint
 */
export function buildDiscoverParams(
  query: string, 
  filters: FilterState
): URLSearchParams {
  const params = new URLSearchParams();

  // إضافة الاستعلام
  if (query) {
    params.set('query', query);
  }

  // إضافة فلتر النوع
  if (filters.genre) {
    params.set('with_genres', String(filters.genre));
  }

  // إضافة فلتر السنة
  if (filters.year) {
    params.set('primary_release_year', String(filters.year));
  }

  // إضافة فلتر التقييم
  if (filters.rating) {
    params.set('vote_average.gte', String(filters.rating));
  }

  // إضافة الترتيب
  switch (filters.sortBy) {
    case 'popularity':
      params.set('sort_by', 'popularity.desc');
      break;
    case 'rating':
      params.set('sort_by', 'vote_average.desc');
      break;
    case 'release_date':
      params.set('sort_by', 'primary_release_date.desc');
      break;
  }

  return params;
}
```

### 5.2 - إنشاء `SearchResults.tsx`

```typescript
// components/SearchResults.tsx
'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useCachedData } from '@/hooks/useCachedData';
import { MovieGrid } from '@/components/MovieGrid';
import { buildDiscoverParams } from '@/lib/url';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function SearchResults() {
  const { searchQuery, filters } = useAppStore();

  // إنشاء مفتاح cache فريد بناءً على كل المتغيرات
  const cacheKey = useMemo(
    () =>
      `search-${searchQuery}-${filters.genre}-${filters.year}-${filters.rating}-${filters.sortBy}`,
    [searchQuery, filters],
  );

  // جلب البيانات مع التخزين المؤقت
  const { data, loading, error } = useCachedData<SearchResponse>(
    cacheKey,
    async () => {
      const params = buildDiscoverParams(searchQuery, filters);
      
      // اختيار الـ endpoint المناسب
      const endpoint = searchQuery 
        ? `/api/tmdb/search/movie` 
        : `/api/tmdb/discover/movie`;
      
      const res = await fetch(`${endpoint}?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      return res.json();
    },
    1000 * 60 * 60, // ساعة واحدة
  );

  // الحالات المختلفة
  
  // لا يوجد استعلام بحث
  if (!searchQuery && !filters.genre && !filters.year && !filters.rating) {
    return (
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-lg">
          ابدأ بالكتابة في مربع البحث أو اختر فلتر للبحث عن الأفلام.
        </p>
      </div>
    );
  }

  // حالة التحميل
  if (loading) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error || !data) {
    return (
      <div className="mt-8 text-center">
        <p className="text-red-400 text-lg">
          فشل تحميل النتائج. الرجاء المحاولة مرة أخرى.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          {error}
        </p>
      </div>
    );
  }

  // لا توجد نتائج
  if (data.results.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-lg">
          لم يتم العثور على نتائج لـ "{searchQuery}"
        </p>
        <p className="text-gray-500 text-sm mt-2">
          جرب تغيير الفلاتر أو استخدام كلمات بحث مختلفة.
        </p>
      </div>
    );
  }

  // عرض النتائج
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {searchQuery 
            ? `نتائج البحث عن "${searchQuery}"` 
            : 'الأفلام المكتشفة'}
        </h2>
        <p className="text-gray-400 text-sm">
          {data.total_results} نتيجة
        </p>
      </div>
      
      <MovieGrid movies={data.results} />
    </div>
  );
}
```

### 5.3 - إنشاء صفحة `/search`

```typescript
// app/search/page.tsx
import { Suspense } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { SearchResults } from '@/components/SearchResults';

// دالة لجلب أنواع الأفلام من TMDB
async function getGenres() {
  const res = await fetch(
    `${process.env.TMDB_API_BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`,
    {
      next: { 
        revalidate: 86400 * 30 // 30 يوم - الأنواع لا تتغير كثيراً
      }
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch genres');
  }

  return res.json();
}

// Metadata للصفحة
export const metadata = {
  title: 'البحث - Netflix Clone',
  description: 'ابحث عن أفلامك ومسلسلاتك المفضلة',
};

export default async function SearchPage() {
  // جلب الأنواع من السيرفر
  const genresData = await getGenres();

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      {/* العنوان الرئيسي */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          اكتشف الأفلام
        </h1>
        <p className="text-gray-400">
          ابحث عن أي فيلم أو استخدم الفلاتر للعثور على ما تريد
        </p>
      </div>

      {/* شريط البحث */}
      <SearchBar />

      {/* الفلاتر */}
      <Filters genres={genresData.genres || []} />

      {/* النتائج مع Suspense */}
      <Suspense 
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </main>
  );
}
```

### 5.4 - تحديث `MovieGrid` (إذا لم يكن موجوداً)

```typescript
// components/MovieGrid.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          href={`/movies/${movie.id}`}
          className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform duration-300"
        >
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              لا توجد صورة
            </div>
          )}

          {/* Overlay with info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="flex items-center gap-1">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
                {movie.release_date && (
                  <span>
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

---

## 🧪 قائمة الاختبار الشاملة - 30-45 دقيقة

### ✅ اختبارات وظيفية

#### 1. اختبار Zustand Store
- [ ] افتح أي صفحة واستخدم React DevTools
- [ ] تحقق من وجود Store في Redux DevTools
- [ ] غير قيمة في الـ Store
- [ ] أعد تحميل الصفحة - يجب أن تبقى القيم محفوظة

#### 2. اختبار useDebounce
- [ ] افتح `/search`
- [ ] ابدأ الكتابة بسرعة
- [ ] راقب Network Tab - لا يجب إرسال طلب مع كل حرف
- [ ] توقف عن الكتابة لـ 500ms
- [ ] يجب إرسال طلب واحد فقط

#### 3. اختبار useCachedData
- [ ] ابحث عن "Inception"
- [ ] انتظر النتائج
- [ ] أعد تحميل الصفحة مع نفس البحث
- [ ] يجب أن تظهر النتائج فوراً (من Cache)
- [ ] افتح DevTools → Application → Local Storage
- [ ] تحقق من وجود المفتاح `search-inception-...`

#### 4. اختبار SearchBar
- [ ] اكتب "Batman"
- [ ] يجب أن يظهر "جاري البحث..." أثناء الكتابة
- [ ] توقف عن الكتابة
- [ ] يجب أن يختفي المؤشر ويتم البحث

#### 5. اختبار Filters
- [ ] اختر نوع "Action"
- [ ] يجب أن تتحدث النتائج
- [ ] أضف سنة "2020"
- [ ] يجب أن تتحدث النتائج مرة أخرى
- [ ] أضف تقييم "7.5"
- [ ] غير الترتيب إلى "Rating"
- [ ] يجب أن تظهر أفلام الأكشن من 2020 بتقييم أعلى من 7.5

#### 6. اختبار SearchResults
- [ ] ابحث عن "xyz123impossible"
- [ ] يجب أن يظهر "لم يتم العثور على نتائج"
- [ ] ابحث عن "Avatar"
- [ ] يجب أن تظهر النتائج مع عدد النتائج
- [ ] اضغط على فيلم
- [ ] يجب أن ينتقل إلى صفحة التفاصيل

### ✅ اختبارات الأداء

#### 7. اختبار Cache Hit Rate
```javascript
// افتح Console وشغل هذا الكود
let cacheHits = 0;
let cacheMisses = 0;

const originalFetch = window.fetch;
window.fetch = function(...args) {
  const key = args[0];
  if (typeof key === 'string' && key.includes('/api/tmdb/')) {
    cacheMisses++;
    console.log('Cache Miss:', key, `(Total: ${cacheMisses})`);
  }
  return originalFetch.apply(this, args);
};

// ثم جرب البحث عن نفس الشيء عدة مرات
```

#### 8. اختبار Network Performance
- [ ] افتح Network Tab
- [ ] ابحث عن "Inception"
- [ ] احسب عدد الطلبات
- [ ] أعد البحث عن "Inception"
- [ ] يجب ألا يكون هناك طلبات جديدة (من Cache)

### ✅ اختبارات التوافق

#### 9. اختبار الأجهزة المختلفة
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] يجب أن تكون الواجهة responsive

#### 10. اختبار المتصفحات
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] يجب أن يعمل localStorage في كل المتصفحات

---

## 📊 Phase 2 Completion Checklist

### ✅ اليوم الأول (Day 1)
- [ ] إنشاء `lib/store.ts` مع Zustand + persist
- [ ] تطبيق `useDebounce` hook
- [ ] تطبيق `useCachedData` hook
- [ ] اختبار الـ Store في صفحة تجريبية
- [ ] اختبار الـ Hooks في صفحة تجريبية

### ✅ اليوم الثاني (Day 2)
- [ ] بناء `SearchBar` component
- [ ] ربطه بالـ Store العام
- [ ] تأكيد عمل الـ debouncing
- [ ] اختبار في صفحة `/test-search`
- [ ] إضافة أيقونة البحث ومؤشر التحميل

### ✅ اليوم الثالث (Day 3)
- [ ] بناء `Filters` component
- [ ] تطبيق `SearchResults` مع TMDB API
- [ ] إنشاء `lib/url.ts` لبناء الـ query params
- [ ] إنشاء صفحة `/search` الكاملة
- [ ] اختبار end-to-end
- [ ] تحسين UX (loading states, error handling)

---

## 🎯 النتائج المتوقعة

بعد الانتهاء من **Phase 2**، يجب أن يكون لديك:

### ✅ الوظائف
- ✅ صفحة `/search` كاملة العمل على Next.js 16 App Router
- ✅ بحث ذكي مع debouncing يقلل طلبات TMDB
- ✅ فلاتر متقدمة (Genre, Year, Rating, Sort) تعمل معاً
- ✅ حالة عامة محفوظة في Zustand + localStorage
- ✅ تخزين مؤقت للنتائج في المتصفح

### ✅ الأداء
- ✅ Cache Hit Rate > 60% (للاستخدام الطبيعي)
- ✅ تقليل الطلبات بنسبة 80% بسبب debouncing
- ✅ سرعة استجابة فورية للنتائج المخزنة

### ✅ تجربة المستخدم
- ✅ لا توجد تأخيرات ملحوظة عند الكتابة
- ✅ النتائج تظهر بسلاسة
- ✅ الفلاتر والبحث يعملان معاً بانسجام
- ✅ الحالة محفوظة بين الجلسات

---

## 🔧 استكشاف الأخطاء (Troubleshooting)

### مشكلة: localStorage لا يعمل

**الحل:**
```typescript
// تحقق من وجود window قبل الاستخدام
if (typeof window !== 'undefined') {
  window.localStorage.setItem(key, value);
}
```

### مشكلة: Debounce لا يعمل

**الحل:**
```typescript
// تأكد من أن delay كافٍ (على الأقل 300ms)
const debounced = useDebounce(value, 500); // ✅

// وليس
const debounced = useDebounce(value, 50); // ❌ قصير جداً
```

### مشكلة: Cache لا يتحدث

**الحل:**
```typescript
// تأكد من تغيير الـ cache key عند تغيير المدخلات
const cacheKey = useMemo(
  () => `search-${query}-${genre}-${year}`,
  [query, genre, year] // ✅ جميع المتغيرات
);

// وليس
const cacheKey = `search-${query}`; // ❌ ينقص genre و year
```

### مشكلة: Rate Limiting من TMDB

**الحل:**
```typescript
// زيادة مدة الـ debounce
const debounced = useDebounce(input, 1000); // زيادة إلى ثانية

// أو زيادة TTL للـ Cache
useCachedData(key, fetcher, 1000 * 60 * 60 * 2); // ساعتين
```

---

## 📚 الموارد الإضافية

### المستندات الرسمية
- [Next.js 16 App Router](https://nextjs.org/docs/app)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TMDB API Documentation](https://developers.themoviedb.org/3)

### أمثلة كود إضافية

#### مثال: Infinite Scroll للنتائج
```typescript
// hooks/useInfiniteScroll.ts
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean
) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 500;
      
      if (scrollPosition >= threshold && hasMore) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, hasMore]);
}
```

#### مثال: Search History
```typescript
// lib/store.ts - إضافة للـ Store
interface AppState {
  // ... existing state
  searchHistory: string[];
  addToHistory: (query: string) => void;
}

// في الـ create
addToHistory: (query) =>
  set((state) => ({
    searchHistory: [
      query,
      ...state.searchHistory.filter(q => q !== query)
    ].slice(0, 10) // آخر 10 عمليات بحث
  }))
```

---

## 🚀 الخطوة التالية: Phase 3

بعد إكمال Phase 2 بنجاح، ستكون جاهزاً للانتقال إلى:

### Phase 3: Enhanced UX
- Dark Mode بدون FOUC
- YouTube Trailers مع Lazy Loading
- Responsive Grid Layouts
- Animations and Transitions
- Skeleton Loading States

---

## 📝 ملاحظات نهائية

### ما تعلمناه في Phase 2:
1. **إدارة الحالة العامة** مع Zustand واستمراريتها
2. **تحسين الأداء** باستخدام Debouncing والـ Cache
3. **تجربة مستخدم سلسة** مع Loading States
4. **التكامل مع APIs** بشكل آمن عبر Next.js Routes

### أفضل الممارسات المطبقة:
- ✅ Separation of Concerns (Store, Hooks, Components)
- ✅ TypeScript للـ Type Safety
- ✅ Client Components فقط عند الحاجة
- ✅ Caching Strategy متعددة الطبقات
- ✅ Error Handling شامل

---

**🎉 مبروك! أنت الآن جاهز للبدء في Phase 2!**

هل تريد البدء في تطبيق أي Step محدد؟ أخبرني وسأساعدك! 😊