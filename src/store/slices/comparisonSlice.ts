import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../types';

const initialState: Movie[] = [];

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToComparison: (state, action: PayloadAction<Movie>) => {
      const exists = state.some(movie => movie.id === action.payload.id);
      if (!exists) {
        const newState = [...state, action.payload];
        return newState.slice(-2); // Оставляем только последние 2
      }
      return state;
    },
    removeFromComparison: (state, action: PayloadAction<number>) => {
      return state.filter(movie => movie.id !== action.payload);
    },
    clearComparison: () => {
      return [];
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions;
export default comparisonSlice.reducer;