import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMovies } from '../../api/kinopoiskApi';
import { Movie, Filters } from '../../types';
import { RootState } from '../store';

interface MoviesState {
  movies: Movie[];
  loading: boolean;
  currentPage: number;
  hasMore: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  currentPage: 1,
  hasMore: true,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page, filters }: { page: number; filters?: Filters }, { rejectWithValue }) => {
    try {
      const response = await getMovies(page, 50, filters);
      return {
        movies: response.docs,
        page,
        hasMore: page < response.pages,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    resetMovies: (state) => {
      state.movies = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    loadMore: (state) => {
      state.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.movies = action.payload.movies;
        } else {
          state.movies = [...state.movies, ...action.payload.movies];
        }
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetMovies, loadMore } = moviesSlice.actions;
export default moviesSlice.reducer;

// Селекторы
export const selectAllMovies = (state: RootState) => state.movies.movies;
export const selectMoviesLoading = (state: RootState) => state.movies.loading;
export const selectHasMore = (state: RootState) => state.movies.hasMore;
export const selectCurrentPage = (state: RootState) => state.movies.currentPage;