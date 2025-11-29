// lib/url.ts
import type { FilterState } from '@/lib/store';

/**
 * بناء query parameters لـ TMDB discover endpoint
 */
export function buildDiscoverParams(
  query: string, 
  filters: FilterState,
  page: number = 1,
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

  // رقم الصفحة
  params.set('page', String(Math.max(1, page)));

  return params;
}