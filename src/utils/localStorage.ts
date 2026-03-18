import { Movie } from '../types';

const FAVORITES_KEY = 'movie_favorites';

export const loadFavorites = (): Movie[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites: Movie[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};