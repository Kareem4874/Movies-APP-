// types/tmdb.ts
// Core movie types used across the app
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  video: boolean;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    iso_639_1: string;
    name: string;
    english_name: string;
  }[];
}

// Video / trailer types
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string; // e.g. 'YouTube'
  type: string; // e.g. 'Trailer', 'Teaser'
  official?: boolean;
  published_at?: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

// Images
export interface MovieImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
}

export interface MovieImages {
  id: number;
  backdrops: MovieImage[];
  posters: MovieImage[];
  logos: MovieImage[];
}

// Release dates / certifications
export interface ReleaseDateEntry {
  certification: string;
  iso_639_1: string;
  release_date: string;
  type: number;
  note: string;
}

export interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDateEntry[];
}

export interface ReleaseDatesResponse {
  id: number;
  results: ReleaseDatesResult[];
}

// Reviews
export interface ReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
  author_details: ReviewAuthorDetails;
}

// Translations
export interface TranslationData {
  title?: string;
  overview?: string;
  homepage?: string;
  tagline?: string;
}

export interface Translation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TranslationData;
}

export interface TranslationResponse {
  id: number;
  translations: Translation[];
}

// Watch providers
export interface WatchProviderOption {
  display_priority: number;
  logo_path: string | null;
  provider_id: number;
  provider_name: string;
}

export interface CountryWatchProviders {
  link: string;
  flatrate?: WatchProviderOption[];
  rent?: WatchProviderOption[];
  buy?: WatchProviderOption[];
  free?: WatchProviderOption[];
  ads?: WatchProviderOption[];
}

export interface WatchProvidersResponse {
  id: number;
  results: Record<string, CountryWatchProviders>;
}
