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
  currentPage: number;

  // الإجراءات (Actions)
  setTheme: (theme: 'light' | 'dark') => void;
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
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
        currentPage: 1,

        // إجراء تغيير الثيم
        setTheme: (theme) => set({ theme }),

        // إجراء تحديث استعلام البحث
        setSearchQuery: (searchQuery) =>
          set({
            searchQuery,
            currentPage: 1,
          }),

        // إجراء تحديث الفلاتر (جزئي)
        updateFilters: (partial) =>
          set((state) => ({
            filters: { ...state.filters, ...partial },
            currentPage: 1,
          })),

        // إجراء إعادة تعيين الفلاتر
        resetFilters: () =>
          set({
            filters: defaultFilters,
            currentPage: 1,
          }),

        // تحديث رقم الصفحة
        setPage: (page) =>
          set({
            currentPage: Math.max(1, page),
          }),
      }),
      {
        name: 'netflix-app-storage', // اسم المفتاح في localStorage
      },
    ),
  ),
);