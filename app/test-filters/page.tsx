// app/test-filters/page.tsx
import { Filters } from '@/components/filters';

// Mock genres for testing
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
          Try changing filters and reload the page—the selections should persist.
        </p>
      </div>
    </div>
  );
}