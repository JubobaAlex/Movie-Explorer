import axios from 'axios';
import { MoviesResponse, Filters, Movie } from '../types';

const API_KEY = process.env.REACT_APP_KINOPOISK_API_KEY;
const BASE_URL = 'https://api.kinopoisk.dev/v1.4';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
  },
});

export const getMovies = async (
  page: number,
  limit: number = 50,
  filters?: Filters
): Promise<MoviesResponse> => {
  const params: any = {
    page,
    limit,
    selectFields: ['id', 'name', 'year', 'rating', 'poster', 'genres', 'description', 'movieLength'],
    notNullFields: ['name', 'poster.url', 'rating.kp'],
  };

  if (filters) {
    if (filters.genres.length > 0) {
      params['genres.name'] = filters.genres;
    }
    if (filters.rating) {
      params['rating.kp'] = `${filters.rating[0]}-${filters.rating[1]}`;
    }
    if (filters.year) {
      params['year'] = `${filters.year[0]}-${filters.year[1]}`;
    }
  }

  const response = await api.get('/movie', { params });
  return response.data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};