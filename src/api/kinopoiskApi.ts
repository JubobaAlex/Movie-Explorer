import axios from 'axios';
import { MoviesResponse, Filters, Movie } from '../types';

const API_KEY = process.env.REACT_APP_KINOPOISK_API_KEY;
const PROXY = 'https://api.allorigins.win/raw?url=';
const BASE_URL = 'https://api.kinopoisk.dev/v1.4';

const api = axios.create({
  timeout: 15000,
  headers: {
    'X-API-KEY': API_KEY,
  }
});

api.interceptors.response.use(
  response => {
    if (response.data && response.data.contents) {
      try {
        response.data = JSON.parse(response.data.contents);
      } catch (e) {
        console.error('Error parsing allorigins response:', e);
      }
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

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
    
    const apiUrl = `${BASE_URL}/movie?${queryString.toString()}`;
    const proxyUrl = `${PROXY}${encodeURIComponent(apiUrl)}`;
    const response = await api.get(proxyUrl);
    
    return response.data;
  } catch (error) {
    console.error('Error in getMovies:', error);
    throw error;
  }
};

export const getMovieById = async (id: number): Promise<Movie> => {
  try {
    const apiUrl = `${BASE_URL}/movie/${id}`;
    const proxyUrl = `${PROXY}${encodeURIComponent(apiUrl)}`;
    const response = await api.get(proxyUrl);
    
    return response.data;
  } catch (error) {
    console.error('Error in getMovieById:', error);
    throw error;
  }
};