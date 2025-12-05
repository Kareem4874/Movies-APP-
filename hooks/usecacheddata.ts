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
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load data';
          setError(message);
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