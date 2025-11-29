import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { MovieGrid } from '@/components/moviegrid';
import { getBackdropURL, getPosterURL } from '@/lib/tmdb/config';
import {
  getMovieDetails,
  getMovieRecommendations,
  getMovieVideos,
  getMovieReleaseDates,
  getMovieReviews,
  getSimilarMovies,
  getMovieTranslations,
  getMovieWatchProviders,
} from '@/lib/tmdb/movies';
import type {
  Video,
  ReleaseDatesResponse,
  WatchProvidersResponse,
  WatchProviderOption,
} from '@/types/tmdb';

// ============= Constants =============
const DEFAULT_REGION = 'US';
const FALLBACK_DESCRIPTION = 'Watch the trailer, learn the key facts, and explore similar titles.';
const VIDEO_PRIORITY: Array<Video['type']> = ['Trailer', 'Teaser', 'Clip', 'Featurette'];
const MAX_REVIEWS = 3;
const MAX_TRANSLATIONS = 8;
const MAX_SIMILAR = 10;
const MAX_RECOMMENDED = 10;

// ============= Types =============
type MovieRouteParams = { id: string };
interface MoviePageProps {
  params: MovieRouteParams | Promise<MovieRouteParams>;
}

// ============= Utility Functions =============
async function resolveMovieId(params: MoviePageProps['params']): Promise<number | null> {
  const resolved = await params;
  const movieId = Number(resolved?.id);
  return Number.isNaN(movieId) ? null : movieId;
}

function selectBestVideo(videos?: Video[] | null): Video | null {
  if (!videos?.length) return null;
  const youtubeVideos = videos.filter((v) => v.site === 'YouTube');
  if (!youtubeVideos.length) return null;

  for (const type of VIDEO_PRIORITY) {
    const match = youtubeVideos.find((v) => v.type.toLowerCase() === type.toLowerCase());
    if (match) return match;
  }
  return youtubeVideos[0];
}

function dedupeMovies<T extends { id: number }>(movies?: T[] | null): T[] {
  if (!movies) return [];
  const seen = new Set<number>();
  return movies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
}

function pickRegionalRelease(data?: ReleaseDatesResponse | null, region = DEFAULT_REGION) {
  if (!data?.results?.length) return null;
  const preferredTypes = [3, 2, 1];
  const bucket = data.results.find((e) => e.iso_3166_1 === region) ?? data.results[0];
  if (!bucket?.release_dates?.length) return null;
  const release = bucket.release_dates.find((e) => preferredTypes.includes(e.type)) ?? bucket.release_dates[0];
  return release ? { region: bucket.iso_3166_1, ...release } : null;
}

function formatReleaseDate(date?: string): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

function formatCurrency(value?: number | null): string | null {
  if (!value || value <= 0) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function summarizeProviders(data?: WatchProvidersResponse | null, region = DEFAULT_REGION) {
  const entry = data?.results?.[region];
  if (!entry) return null;

  type ProviderKey = 'flatrate' | 'rent' | 'buy' | 'free' | 'ads';
  const categoryLabels: Record<ProviderKey, string> = {
    flatrate: 'Stream',
    rent: 'Rent',
    buy: 'Buy',
    free: 'Free',
    ads: 'Ad-supported',
  };

  const sections = (Object.keys(categoryLabels) as ProviderKey[])
    .filter((key) => entry[key]?.length)
    .map((key) => ({ label: categoryLabels[key], providers: entry[key]! }));

  return { link: entry.link, sections };
}

async function fetchMovieData(movieId: number) {
  const [recommendations, videos, releaseDates, reviews, similar, translations, watchProviders] = await Promise.all([
    getMovieRecommendations(movieId).catch(() => null),
    getMovieVideos(movieId).catch(() => null),
    getMovieReleaseDates(movieId).catch(() => null),
    getMovieReviews(movieId).catch(() => null),
    getSimilarMovies(movieId).catch(() => null),
    getMovieTranslations(movieId).catch(() => null),
    getMovieWatchProviders(movieId).catch(() => null),
  ]);

  return { recommendations, videos, releaseDates, reviews, similar, translations, watchProviders };
}

// ============= Metadata =============
export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movieId = await resolveMovieId(params);
  if (!movieId) return { title: 'Movie Not Found', description: FALLBACK_DESCRIPTION };

  try {
    const movie = await getMovieDetails(movieId);
    const description = movie.overview || FALLBACK_DESCRIPTION;
    const backdropImage = movie.backdrop_path ? getBackdropURL(movie.backdrop_path) : null;

    return {
      title: `${movie.title} | Movie Details`,
      description,
      openGraph: {
        title: movie.title,
        description,
        images: backdropImage ? [{ url: backdropImage }] : undefined,
      },
    };
  } catch {
    return { title: 'Movie Details', description: FALLBACK_DESCRIPTION };
  }
}

// ============= Main Component =============
export default async function MovieDetailsPage({ params }: MoviePageProps) {
  const movieId = await resolveMovieId(params);
  if (!movieId) notFound();

  let movie;
  try {
    movie = await getMovieDetails(movieId);
  } catch (error) {
    console.error('Failed to load movie details', error);
    notFound();
  }
  if (!movie) notFound();

  const data = await fetchMovieData(movieId);

  // Process data
  const trailer = selectBestVideo(data.videos?.results);
  const recommendedMovies = dedupeMovies(data.recommendations?.results).slice(0, MAX_RECOMMENDED);
  const similarMovies = dedupeMovies(data.similar?.results).slice(0, MAX_SIMILAR);
  const releaseInfo = pickRegionalRelease(data.releaseDates);
  const formattedReleaseDate = formatReleaseDate(releaseInfo?.release_date);
  const reviewItems = data.reviews?.results?.slice(0, MAX_REVIEWS) ?? [];
  const translationItems = data.translations?.translations?.filter((t) => t.data?.overview).slice(0, MAX_TRANSLATIONS) ?? [];
  const providerSummary = summarizeProviders(data.watchProviders);

  // URLs and metadata
  const posterUrl = getPosterURL(movie.poster_path, 'large');
  const backdropUrl = getBackdropURL(movie.backdrop_path, 'original');
  const releaseYear = movie.release_date ? parseInt(movie.release_date.slice(0, 4), 10) : null;
  const budget = formatCurrency(movie.budget);
  const revenue = formatCurrency(movie.revenue);

  const infoChips = [
    releaseYear && `${releaseYear}`,
    movie.runtime && `${movie.runtime} min`,
    movie.vote_average && `⭐ ${movie.vote_average.toFixed(1)}`,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* Hero Section */}
      <HeroSection 
        backdropUrl={backdropUrl} 
        title={movie.title}
        posterUrl={posterUrl}
        tagline={movie.tagline}
        infoChips={infoChips}
        overview={movie.overview}
        genres={movie.genres}
        originalLanguage={movie.original_language}
        budget={budget}
        revenue={revenue}
        releaseInfo={releaseInfo}
        formattedReleaseDate={formattedReleaseDate}
      />

      {/* Content Sections */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        <TrailerSection trailer={trailer} movieTitle={movie.title} />
        <WatchProvidersSection providerSummary={providerSummary} />
        <ReviewsSection reviews={reviewItems} />
        <SimilarMoviesSection movies={similarMovies} totalResults={data.similar?.total_results} />
        <TranslationsSection translations={translationItems} />
        <RecommendationsSection movies={recommendedMovies} totalResults={data.recommendations?.total_results} />
      </div>
    </div>
  );
}

// ============= Hero Section Component =============
function HeroSection({
  backdropUrl,
  title,
  posterUrl,
  tagline,
  infoChips,
  overview,
  genres,
  originalLanguage,
  budget,
  revenue,
  releaseInfo,
  formattedReleaseDate,
}: any) {
  return (
    <>
      {/* Backdrop */}
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={`${title} backdrop`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-20 md:-mt-32 z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Poster */}
            {posterUrl && (
              <div className="w-32 md:w-48 lg:w-64 shrink-0 mx-auto md:mx-0">
                <div className="relative aspect-[2/3] rounded-lg md:rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <Image
                    src={posterUrl}
                    alt={`${title} poster`}
                    fill
                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 192px, 256px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 space-y-4 md:space-y-6">
              {/* Title */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                  {title}
                </h1>
                {tagline && (
                  <p className="text-sm md:text-base lg:text-lg text-gray-300 italic">{tagline}</p>
                )}
              </div>

              {/* Info Chips */}
              {infoChips.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                  {infoChips.map((chip: string) => (
                    <span
                      key={chip}
                      className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-2">Overview</h2>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {overview || 'No overview provided for this title.'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <DetailCard label="Genres">
                  {genres.length > 0 ? genres.map((g: any) => g.name).join(', ') : 'Uncategorized'}
                </DetailCard>
                <DetailCard label="Language">
                  <span className="capitalize">{originalLanguage}</span>
                </DetailCard>
                {budget && <DetailCard label="Budget">{budget}</DetailCard>}
                {revenue && <DetailCard label="Revenue">{revenue}</DetailCard>}
                {releaseInfo && (
                  <div className="col-span-2 rounded-lg border border-white/10 p-3 md:p-4 bg-white/5 backdrop-blur-sm">
                    <p className="text-gray-400 uppercase tracking-wide text-xs mb-2">
                      Release ({releaseInfo.region})
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
                      {formattedReleaseDate && <span className="text-white/90">{formattedReleaseDate}</span>}
                      {releaseInfo.certification && (
                        <span className="px-2 md:px-3 py-1 rounded-full border border-white/20 bg-white/5">
                          {releaseInfo.certification}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============= UI Components =============
function DetailCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 p-3 md:p-4 bg-white/5 backdrop-blur-sm">
      <p className="text-gray-400 uppercase tracking-wide text-xs mb-1">{label}</p>
      <p className="text-white/90">{children}</p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <div className="flex items-center gap-4">
          {subtitle && <span className="text-xs md:text-sm text-gray-400 hidden sm:block">{subtitle}</span>}
          {action}
        </div>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-8 px-4 bg-white/5 rounded-lg border border-white/10">
      <p className="text-gray-400 text-sm md:text-base">{children}</p>
    </div>
  );
}

// ============= Content Sections =============
function TrailerSection({ trailer, movieTitle }: { trailer: Video | null; movieTitle: string }) {
  return (
    <Section title="Official Trailer" subtitle={trailer?.name}>
      {trailer ? (
        <div className="relative w-full aspect-video rounded-lg md:rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&modestbranding=1`}
            title={`${movieTitle} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />
        </div>
      ) : (
        <EmptyState>We could not find a playable trailer for this title right now.</EmptyState>
      )}
    </Section>
  );
}

function WatchProvidersSection({ providerSummary }: any) {
  return (
    <Section
      title="Where to Watch"
      action={
        providerSummary?.link && (
          <a
            href={providerSummary.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs md:text-sm text-netflix-red hover:underline whitespace-nowrap"
          >
            View all
          </a>
        )
      }
    >
      {providerSummary?.sections.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {providerSummary.sections.map((section: any) => (
            <div key={section.label} className="rounded-lg md:rounded-xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm">
              <p className="text-gray-300 font-semibold mb-3 text-sm md:text-base">{section.label}</p>
              <div className="flex flex-wrap gap-2">
                {section.providers.map((provider: any) => (
                  <span
                    key={provider.provider_id}
                    className="px-2 md:px-3 py-1 rounded-full border border-white/20 text-xs md:text-sm bg-white/5"
                  >
                    {provider.provider_name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>
          {providerSummary ? 'No streaming partners found for your region.' : 'Watch provider data not available yet.'}
        </EmptyState>
      )}
    </Section>
  );
}

function ReviewsSection({ reviews }: any) {
  return (
    <Section title="Featured Reviews">
      {reviews.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review: any) => (
            <article
              key={review.id}
              className="rounded-lg md:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex flex-col gap-3"
            >
              <div>
                <p className="font-semibold text-sm md:text-base">{review.author}</p>
                {review.author_details.rating && (
                  <p className="text-xs md:text-sm text-gray-400">⭐ {review.author_details.rating}/10</p>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-300 line-clamp-6">{review.content}</p>
              <a
                href={review.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs md:text-sm text-netflix-red hover:underline mt-auto"
              >
                Read full review →
              </a>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState>Reviews are not available for this movie yet.</EmptyState>
      )}
    </Section>
  );
}

function SimilarMoviesSection({ movies, totalResults }: any) {
  return (
    <Section title="Similar Titles" subtitle={`${totalResults ?? movies.length} result(s)`}>
      {movies.length ? <MovieGrid movies={movies} /> : <EmptyState>No similar movies found at the moment.</EmptyState>}
    </Section>
  );
}

function TranslationsSection({ translations }: any) {
  return (
    <Section title="Translations">
      {translations.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {translations.map((t: any) => (
            <div key={`${t.iso_3166_1}-${t.iso_639_1}`} className="rounded-lg md:rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
              <p className="font-semibold text-sm md:text-base">{t.english_name}</p>
              <p className="text-xs md:text-sm text-gray-400">{t.name} • {t.iso_3166_1}</p>
              {t.data.tagline && (
                <p className="text-xs md:text-sm text-white/80 mt-2 italic line-clamp-2">"{t.data.tagline}"</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>No translation data is currently available.</EmptyState>
      )}
    </Section>
  );
}

function RecommendationsSection({ movies, totalResults }: any) {
  return (
    <Section title="You Might Also Like" subtitle={`${totalResults ?? movies.length} recommendation(s)`}>
      {movies.length ? <MovieGrid movies={movies} /> : <EmptyState>No related titles found at the moment.</EmptyState>}
    </Section>
  );
}