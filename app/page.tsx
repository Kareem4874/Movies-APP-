// app/page.tsx
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense, type ElementType } from 'react';
import { getPopularMovies, getTrendingMovies, getTopRatedMovies } from '@/lib/tmdb/movies';
import { SkeletonGrid } from '@/components/skeletongrid';
// import { HeroSection } from '@/components/HeroSection';
import { TrendingUp, Star, Trophy, ArrowRight } from 'lucide-react';

const MovieGrid = dynamic(() => import('@/components/moviegrid').then((m) => m.MovieGrid), {
  loading: () => null,
});

export const revalidate = 3600; // Revalidate every hour

export default function HomePage() {
  return (
    <main className="min-h-screen">
      
        <section id="hero" className="container mx-auto px-4 py-10 space-y-12">
        <div className="space-y-4 md:space-y-6 max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-red-500 to-orange-400 bg-clip-text text-transparent">
            Unlimited movies, TV shows, and more.
          </h1>
          <p className="text-base md:text-lg text-gray-300">
            Discover trending titles, popular hits, and top rated movies powered by Kareem Abdulbaset.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/#trending"
              className="px-6 py-3 rounded-md bg-netflix-red text-white font-semibold hover:bg-red-700 transition-colors text-center"
            >
              Start watching
            </Link>
            <Link
              href="/search"
              className="px-6 py-3 rounded-md bg-white/10 text-sm text-gray-200 hover:bg-white/20 transition-colors text-center"
            >
              Explore advanced search
            </Link>
          </div>
        </div>
      </section>


      {/* Content Sections */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
          {/* Trending Today */}
          <section id="trending" className="scroll-mt-20">
            <Suspense fallback={<SkeletonGrid title="🔥 Trending Today" />}>
              <TrendingSection />
            </Suspense>
          </section>

          {/* Popular Movies */}
          <section id="popular" className="scroll-mt-20">
            <Suspense fallback={<SkeletonGrid title="⭐ Popular Movies" />}>
              <PopularSection />
            </Suspense>
          </section>

          {/* Top Rated */}
          <section id="top-rated" className="scroll-mt-20">
            <Suspense fallback={<SkeletonGrid title="🏆 Top Rated" />}>
              <TopRatedSection />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}

/**
 * Server Component - Trending Movies
 */
async function TrendingSection() {
  let data;
  try {
    data = await getTrendingMovies('day');
  } catch (error) {
    console.error('Failed to load trending movies during build:', error);
    data = { results: [] };
  }
  
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={TrendingUp}
        title="Trending Today"
        subtitle="Most watched movies right now"
        href="/search?sort=trending"
      />
      <MovieGrid movies={data.results} priority />
    </div>
  );
}

/**
 * Server Component - Popular Movies
 */
async function PopularSection() {
  let data;
  try {
    data = await getPopularMovies();
  } catch (error) {
    console.error('Failed to load popular movies during build:', error);
    data = { results: [] };
  }
  
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Star}
        title="Popular Movies"
        subtitle="Audience favorites this month"
        href="/search?sort=popularity"
      />
      <MovieGrid movies={data.results} />
    </div>
  );
}

/**
 * Server Component - Top Rated
 */
async function TopRatedSection() {
  let data;
  try {
    data = await getTopRatedMovies();
  } catch (error) {
    console.error('Failed to load top rated movies during build:', error);
    data = { results: [] };
  }
  
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Trophy}
        title="Top Rated"
        subtitle="Critically acclaimed masterpieces"
        href="/search?sort=rating"
      />
      <MovieGrid movies={data.results} />
    </div>
  );
}

/**
 * Section Header Component
 */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  href,
}: {
  icon: ElementType;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
            <Icon className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {title}
          </h2>
        </div>
        <p className="text-sm text-slate-400 ml-14">
          {subtitle}
        </p>
      </div>
      
      <Link
        href={href}
        className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          View All
        </span>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  );
}