import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import {
  selectAllMovies,
  selectMoviesLoading,
  selectHasMore,
  selectCurrentPage,
  fetchMovies,
  resetMovies,
  loadMore,
} from '../../store/slices/moviesSlice';
import { updateFilters } from '../../store/slices/filtersSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { addToComparison, removeFromComparison, clearComparison } from '../../store/slices/comparisonSlice';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { MovieFilters } from '../../components/MovieFilters/MovieFilters';
import { ConfirmationModal } from '../../components/Modal/ConfirmationModal';
import { ComparisonBar } from '../../components/Comparison/ComparisonBar';
import { Movie, Filters } from '../../types';

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const movies = useAppSelector(selectAllMovies);
  const loading = useAppSelector(selectMoviesLoading);
  const hasMore = useAppSelector(selectHasMore);
  const currentPage = useAppSelector(selectCurrentPage);
  const filters = useAppSelector((state) => state.filters);
  const favorites = useAppSelector((state) => state.favorites);
  const comparisonMovies = useAppSelector((state) => state.comparison);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    const genres = searchParams.getAll('genre');
    const ratingFrom = Number(searchParams.get('ratingFrom')) || 0;
    const ratingTo = Number(searchParams.get('ratingTo')) || 10;
    const yearFrom = Number(searchParams.get('yearFrom')) || 1990;
    const yearTo = Number(searchParams.get('yearTo')) || new Date().getFullYear();

    const urlFilters: Filters = {
      genres,
      rating: [ratingFrom, ratingTo],
      year: [yearFrom, yearTo],
    };

    dispatch(updateFilters(urlFilters));
  }, [dispatch, searchParams]);

  useEffect(() => {
    const loadMovies = async () => {
      setInitialLoad(true);
      dispatch(resetMovies());
      await dispatch(fetchMovies({ page: 1, filters }));
      setInitialLoad(false);
    };
    
    loadMovies();
  }, [dispatch, filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    filters.genres.forEach(genre => params.append('genre', genre));
    params.set('ratingFrom', filters.rating[0].toString());
    params.set('ratingTo', filters.rating[1].toString());
    params.set('yearFrom', filters.year[0].toString());
    params.set('yearTo', filters.year[1].toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (inView && hasMore && !loading && !initialLoad) {
      dispatch(loadMore());
      dispatch(fetchMovies({ page: currentPage + 1, filters }));
    }
  }, [inView, hasMore, loading, dispatch, currentPage, filters, initialLoad]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleFavoriteClick = (movie: Movie) => {
    const isFavorite = favorites.some(m => m.id === movie.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      setSelectedMovie(movie);
      setModalOpen(true);
    }
  };

  const handleConfirmFavorite = () => {
    if (selectedMovie) {
      dispatch(addToFavorites(selectedMovie));
      setModalOpen(false);
      setSelectedMovie(null);
    }
  };

  const handleCompareClick = (movie: Movie) => {
    dispatch(addToComparison(movie));
  };

  const handleFiltersChange = (newFilters: Filters) => {
    dispatch(updateFilters(newFilters));
  };

  if (initialLoad && loading && movies.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <MovieFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Загружаем фильмы...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <MovieFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
            lg: '1fr 1fr 1fr 1fr'
          },
          gap: 3,
        }}
      >
        {movies.map((movie) => (
          <Box key={movie.id}>
            <MovieCard
              movie={movie}
              isFavorite={favorites.some(m => m.id === movie.id)}
              onFavoriteClick={handleFavoriteClick}
              onCompareClick={handleCompareClick}
              onClick={() => handleMovieClick(movie.id)}
            />
          </Box>
        ))}
      </Box>

      {loading && !initialLoad && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {hasMore && !loading && !initialLoad && (
        <Box ref={ref} sx={{ height: 20 }} />
      )}

      {!loading && !initialLoad && movies.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Фильмы не найдены
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Попробуйте изменить параметры фильтрации
          </Typography>
        </Box>
      )}

      <ConfirmationModal
        open={modalOpen}
        title="Добавление в избранное"
        message={`Вы уверены, что хотите добавить фильм "${selectedMovie?.name}" в избранное?`}
        onConfirm={handleConfirmFavorite}
        onCancel={() => {
          setModalOpen(false);
          setSelectedMovie(null);
        }}
      />

      <ComparisonBar
        movies={comparisonMovies}
        onRemove={(id) => dispatch(removeFromComparison(id))}
        onClear={() => dispatch(clearComparison())}
      />
    </Container>
  );
};