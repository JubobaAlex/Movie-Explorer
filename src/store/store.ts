import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import filtersReducer from './slices/filtersSlice';
import favoritesReducer from './slices/favoritesSlice';
import comparisonReducer from './slices/comparisonSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
    comparison: comparisonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;