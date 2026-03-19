import axios from 'axios';
import { MoviesResponse, Filters, Movie } from '../types';

const API_KEY = process.env.REACT_APP_KINOPOISK_API_KEY;

const api = axios.create({
  timeout: 15000,
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

  try {
    const queryString = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (Array.isArray(params[key])) {
        params[key].forEach((value: string) => {
          queryString.append(`${key}[]`, value);
        });
      } else {
        queryString.append(key, params[key]);
      }
    });
    
    const apiUrl = `https://api.kinopoisk.dev/v1.4/movie?${queryString.toString()}`;
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
    
    console.log('Fetching via proxy:', proxyUrl);
    const response = await api.get(proxyUrl);
    
    return response.data;
  } catch (error) {
    console.error('Error in getMovies:', error);
    throw error;
  }
};

export const getMovieById = async (id: number): Promise<Movie> => {
  try {
    const apiUrl = `https://api.kinopoisk.dev/v1.4/movie/${id}`;
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
    
    console.log('Fetching movie by ID via proxy:', proxyUrl);
    const response = await api.get(proxyUrl);
    
    return response.data;
  } catch (error) {
    console.error('Error in getMovieById:', error);
    throw error;
  }
};