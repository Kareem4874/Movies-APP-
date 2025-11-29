# 🧱 Phase 0: Foundation - إعداد المشروع وقاعدة الأمان

## 📌 نظرة عامة

**المدة:** يومان  
**الهدف:** إنشاء مشروع **Next.js 16 App Router** حديث مع TypeScript و Tailwind CSS وإعدادات أمان صارمة، جاهز لدمج TMDB API.

> هذه المرحلة تركز فقط على **إعداد المشروع** و**قاعدة الأمان**. لا توجد بيانات حقيقية من TMDB بعد - سيبدأ ذلك في المرحلة 1.

---

## 🎯 الأهداف الرئيسية

| الهدف | الوصف | الأولوية |
|-------|-------|----------|
| **Next.js 16 App Router** | إنشاء مشروع جديد بهيكل App Router | 🔴 حرج |
| **TypeScript Strict** | تفعيل TypeScript الصارم لكود أكثر أماناً | 🔴 حرج |
| **Tailwind + Dark Mode** | إعداد Tailwind مع استراتيجية `class` للوضع الداكن | 🟡 عالي |
| **هيكل API** | بناء `app/api/tmdb/[...path]/route.ts` | 🟡 عالي |
| **البيئة والأمان** | إعداد `.env` + CSP + نطاقات الصور | 🟢 متوسط |

---

## 📅 التقسيم اليومي

### **اليوم 1: إنشاء المشروع وإعداد TypeScript**
- ✅ إنشاء مشروع Next.js 16 مع App Router
- ✅ تفعيل TypeScript الصارم
- ✅ تنظيف القالب الافتراضي

### **اليوم 2: Tailwind، البيئة، هيكل API والأمان**
- ✅ إعداد Tailwind (بما في ذلك الوضع الداكن)
- ✅ إنشاء `.env.local` و `.env.local.example`
- ✅ إضافة `next.config.js` مع CSP ونطاقات صور TMDB
- ✅ إنشاء `app/api/tmdb/[...path]/route.ts` كهيكل أولي

---

## 🗂️ الملفات التي ستقوم بإنشائها/تحديثها

```
netflix-frontend/
├── app/
│   ├── layout.tsx                 # التخطيط الرئيسي (محدّث)
│   ├── page.tsx                   # الصفحة الرئيسية البسيطة (محدّث)
│   ├── globals.css                # أنماط Tailwind العامة (محدّث)
│   └── api/
│       └── tmdb/
│           └── [...path]/
│               └── route.ts       # وسيط TMDB الأولي (جديد)
│
├── lib/
│   └── utils.ts                   # دوال مساعدة (جديد)
│
├── public/
│   ├── favicon.ico                # أيقونة التطبيق (افتراضي)
│   └── robots.txt                 # اختياري للـ SEO (جديد)
│
├── next.config.js                 # إعدادات Next.js (جديد/محدّث)
├── tailwind.config.ts             # إعدادات Tailwind (محدّث)
├── postcss.config.mjs             # إعدادات PostCSS (افتراضي)
├── tsconfig.json                  # وضع TypeScript الصارم (محدّث)
├── .env.local.example             # قالب متغيرات البيئة (جديد)
├── .env.local                     # الأسرار المحلية (جديد - غير مرفوع)
├── .gitignore                     # تجاهل env والبناء (محدّث)
└── package.json                   # التبعيات والسكريبتات (محدّث)
```

---

## 🚀 STEP 1: إنشاء مشروع Next.js 16 جديد (30-45 دقيقة)

**الغرض:** بناء مشروع Next.js 16 حديث مع TypeScript و Tailwind و ESLint.

### 1.1 – تشغيل `create-next-app`

من الـ terminal في مجلد العمل الرئيسي:

```bash
npx create-next-app@latest netflix-frontend
```

ستظهر لك أسئلة تفاعلية - اختر الإعدادات التالية:

```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like your code inside a `src/` directory? › No
✔ Would you like to use App Router? › Yes
✔ Would you like to use Turbopack for next dev? › No
✔ Would you like to customize the import alias (@/* by default)? › No
```

ثم انتقل إلى المجلد:

```bash
cd netflix-frontend
```

### 1.2 – التحقق من هيكل App Router

تأكد من وجود مجلد `app/`:

```bash
ls app/
# يجب أن ترى: layout.tsx, page.tsx, globals.css, favicon.ico
```

### 1.3 – اختبار السيرفر

```bash
npm run dev
```

افتح المتصفح على `http://localhost:3000`

إذا ظهرت صفحة Next.js الافتراضية، فالإعداد صحيح ✅

---

## 🔧 STEP 2: إعداد TypeScript الصارم (20-30 دقيقة)

**الغرض:** اكتشاف الأخطاء مبكراً باستخدام الكتابة الصارمة.

### 2.1 – تحديث `tsconfig.json`

افتح `tsconfig.json` وتأكد من هذه الإعدادات (معظمها موجود افتراضياً):

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

> **نقطة مهمة:** `"strict": true` يضمن كتابة TypeScript نظيف في جميع المراحل.

### 2.2 – إضافة سكريبت للتحقق من الأنواع

في `package.json`، أضف سكريبت `type-check`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

اختبر:

```bash
npm run type-check
```

يجب أن يعمل بدون أخطاء ✅

---

## 🎨 STEP 3: إعداد Tailwind CSS + الوضع الداكن (30-40 دقيقة)

**الغرض:** إعداد نظام تصميم متسق مع الوضع الداكن باستخدام استراتيجية `class`.

### 3.1 – تحديث `tailwind.config.ts`

افتح `tailwind.config.ts` وحدثه بهذه الإعدادات:

```ts
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
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414',
          darkGray: '#0F0F0F',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 3.2 – تحديث `app/globals.css`

افتح `app/globals.css` واستبدل المحتوى بهذا:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-white text-gray-900 dark:bg-netflix-black dark:text-gray-100;
}

/* Custom scrollbar for dark mode */
@layer utilities {
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

### 3.3 – تحديث `app/layout.tsx`

حدث الملف ليكون بسيطاً وجاهزاً للمراحل القادمة:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Netflix Frontend - Movie Discovery',
  description: 'A modern movie and TV show discovery platform powered by TMDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 3.4 – تحديث `app/page.tsx`

أنشئ صفحة رئيسية بسيطة كـ placeholder:

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-netflix-black to-netflix-darkGray">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-netflix-red">
          Netflix Frontend
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          Phase 0: Foundation Complete ✅
        </p>
        <p className="text-gray-400 max-w-xl">
          Modern movie discovery platform using Next.js 16 App Router, TypeScript, and Tailwind CSS
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="px-6 py-3 bg-netflix-red text-white rounded-md font-semibold">
            Ready for Phase 1
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## 🔐 STEP 4: إعداد متغيرات البيئة (30 دقيقة)

**الغرض:** تجهيز متغيرات البيئة المتعلقة بـ TMDB من البداية.

### 4.1 – إنشاء `.env.local.example`

أنشئ ملف `.env.local.example` في الجذر:

```env
# .env.local.example
# انسخ هذا الملف إلى .env.local وأضف قيمك الحقيقية

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_API_BASE_URL=https://api.themoviedb.org/3

# Rate Limiting (سيستخدم لاحقاً في المرحلة 1)
RATE_LIMIT_MAX_REQUESTS=40
RATE_LIMIT_WINDOW_MS=60000
```

### 4.2 – إنشاء `.env.local` (لن يتم رفعه)

أنشئ ملف `.env.local` في الجذر:

```env
# .env.local
# احصل على TMDB API Key من: https://www.themoviedb.org/settings/api

TMDB_API_KEY=your_actual_api_key_here
TMDB_API_BASE_URL=https://api.themoviedb.org/3
RATE_LIMIT_MAX_REQUESTS=40
RATE_LIMIT_WINDOW_MS=60000
```

> **مهم جداً:** لا تشارك هذا الملف أو ترفعه على Git!

### 4.3 – تحديث `.gitignore`

تأكد من أن `.gitignore` يحتوي على:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## 🛡️ STEP 5: إعداد Next.js Config - CSP وصور TMDB (30-40 دقيقة)

**الغرض:** إضافة Content Security Policy الأساسية والسماح بصور TMDB.

### 5.1 – إنشاء/تحديث `next.config.js`

أنشئ ملف `next.config.js` في الجذر:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
  
  // إعدادات أمان
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube-nocookie.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: https://image.tmdb.org https://img.youtube.com;
              media-src 'self' https://www.youtube-nocookie.com;
              connect-src 'self';
              frame-src 'self' https://www.youtube-nocookie.com;
              font-src 'self' data:;
            `.replace(/\s+/g, ' ').trim(),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 5.2 – اختبار الإعدادات

أعد تشغيل السيرفر:

```bash
npm run dev
```

تحقق من عدم وجود أخطاء في Console ✅

---

## 🔌 STEP 6: هيكل API الأولي لوسيط TMDB (20-30 دقيقة)

**الغرض:** تجهيز هيكل المجلد للوسيط الآمن لـ TMDB الذي سيتم تنفيذه بالكامل في المرحلة 1.

### 6.1 – إنشاء المجلد والهيكل الأولي

أنشئ المجلدات:

```bash
mkdir -p app/api/tmdb/\[...path\]
```

ثم أنشئ ملف route handler بسيط:

```tsx
// app/api/tmdb/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return NextResponse.json({
    status: 'ok',
    message: 'TMDB proxy placeholder - will be implemented in Phase 1',
    endpoint: params.path.join('/'),
    timestamp: new Date().toISOString(),
  });
}
```

### 6.2 – اختبار API Placeholder

زر الرابط في المتصفح:

```
http://localhost:3000/api/tmdb/movie/popular
```

يجب أن ترى JSON response مثل:

```json
{
  "status": "ok",
  "message": "TMDB proxy placeholder - will be implemented in Phase 1",
  "endpoint": "movie/popular",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🛠️ STEP 7: إضافة دوال مساعدة (15-20 دقيقة)

**الغرض:** إنشاء ملف utilities أساسي سيستخدم في جميع المراحل.

### 7.1 – إنشاء `lib/utils.ts`

أنشئ المجلد والملف:

```bash
mkdir lib
```

ثم أنشئ `lib/utils.ts`:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * دمج class names مع Tailwind بذكاء
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تنسيق التاريخ
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * تنسيق التقييم
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * اختصار النص
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
```

### 7.2 – تثبيت التبعيات المطلوبة

```bash
npm install clsx tailwind-merge
npm install -D @types/node
```

---

## 🧪 STEP 8: الاختبار النهائي (20-30 دقيقة)

بعد الانتهاء من جميع الخطوات، قم بإجراء هذه الاختبارات:

### 8.1 – فحص TypeScript

```bash
npm run type-check
```

يجب أن يعمل بدون أخطاء ✅

### 8.2 – فحص ESLint

```bash
npm run lint
```

إذا وجدت تحذيرات، صححها أو تجاهلها حسب الحاجة.

### 8.3 – اختبار التطبيق

```bash
npm run dev
```

افتح المتصفح وتحقق من:

1. **الصفحة الرئيسية** `http://localhost:3000`
   - يجب أن تظهر رسالة "Netflix Frontend - Phase 0: Foundation Complete"
   - تأكد من عدم وجود أخطاء في Console

2. **API Placeholder** `http://localhost:3000/api/tmdb/movie/popular`
   - يجب أن ترجع JSON response صحيح

3. **الوضع الداكن**
   - افتح DevTools → Console
   - اكتب: `document.documentElement.classList.add('dark')`
   - يجب أن يتغير الخلفية للأسود

### 8.4 – اختبار البناء

```bash
npm run build
```

يجب أن يكتمل البناء بنجاح بدون أخطاء ✅

---

## 📊 قائمة التحقق من اكتمال Phase 0

### اليوم 1 ✅
- [ ] إنشاء مشروع Next.js 16 App Router مع TypeScript و Tailwind
- [ ] تشغيل dev server بنجاح
- [ ] تفعيل TypeScript الصارم في `tsconfig.json`
- [ ] إضافة سكريبت `type-check` في `package.json`

### اليوم 2 ✅
- [ ] إعداد Tailwind مع `darkMode: 'class'`
- [ ] تحديث `layout.tsx` و `page.tsx` بتصميم أساسي
- [ ] إنشاء `.env.local.example` و `.env.local`
- [ ] تحديث `.gitignore` لتجاهل ملفات env و `.next`
- [ ] إضافة `next.config.js` مع CSP وإعدادات صور TMDB
- [ ] إنشاء `app/api/tmdb/[...path]/route.ts` placeholder
- [ ] إضافة `lib/utils.ts` مع دوال مساعدة
- [ ] اختبار جميع الإعدادات بنجاح

---

## 🎯 النتائج المتوقعة

بنهاية **Phase 0**، يجب أن يكون لديك:

✅ **مشروع Next.js 16 App Router** جاهز تماماً  
✅ **إعدادات TypeScript صارمة** لكتابة كود آمن  
✅ **Tailwind CSS** مع وضع داكن جاهز للعمل على UX  
✅ **متغيرات البيئة** محضرة لـ TMDB  
✅ **قواعد CSP وتحسين الصور** الأساسية  
✅ **هيكل API** جاهز للمرحلة 1 (الوسيط الآمن لـ TMDB)

هذا الأساس يسمح لك بالتركيز في **المرحلة 1** على **طبقة البيانات الأساسية** (الوسيط الآمن لـ TMDB، تحديد المعدل، وجلب البيانات) دون القلق بشأن الإعداد الأساسي.

---

## 🚀 الخطوة التالية

بمجرد الانتهاء من Phase 0، انتقل إلى:

**Phase 1: Core Data Layer**
- بناء وسيط TMDB API مع تحديد المعدل
- تنفيذ Server Components لقوائم الأفلام
- إنشاء أنواع TypeScript لاستجابات API
- إعداد Next.js data caching

---

## 📚 موارد إضافية

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TMDB API Documentation](https://developers.themoviedb.org/3)

---

**تم بناؤه بـ ❤️ باستخدام Next.js 16، TypeScript، و Tailwind CSS**