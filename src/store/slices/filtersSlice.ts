import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters } from '../../types';

const initialState: Filters = {
  genres: [],
  rating: [0, 10],
  year: [1990, new Date().getFullYear()],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { updateFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;