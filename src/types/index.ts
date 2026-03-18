export interface Movie {
  id: number;
  name: string;
  alternativeName?: string;
  year: number;
  description?: string;
  shortDescription?: string;
  rating: {
    kp: number;
    imdb: number;
    filmCritics?: number;
  };
  poster?: {
    url: string;
    previewUrl: string;
  };
  genres: Array<{
    name: string;
  }>;
  countries?: Array<{
    name: string;
  }>;
  movieLength?: number;
  ageRating?: number;
  releaseDate?: string;
}

export interface MoviesResponse {
  docs: Movie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Filters {
  genres: string[];
  rating: [number, number];
  year: [number, number];
}