import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../types';
import { loadFavorites, saveFavorites } from '../../utils/localStorage';

const initialState: Movie[] = loadFavorites();

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Movie>) => {
      const exists = state.some(movie => movie.id === action.payload.id);
      if (!exists) {
        const newState = [...state, action.payload];
        saveFavorites(newState);
        return newState;
      }
      return state;
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      const newState = state.filter(movie => movie.id !== action.payload);
      saveFavorites(newState);
      return newState;
    },
    clearFavorites: () => {
      saveFavorites([]);
      return [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;