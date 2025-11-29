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