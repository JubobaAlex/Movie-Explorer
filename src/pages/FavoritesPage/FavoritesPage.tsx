import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { removeFromFavorites } from '../../store/slices/favoritesSlice';
import { addToComparison } from '../../store/slices/comparisonSlice';
import { Movie } from '../../types';
import { ConfirmationModal } from '../../components/Modal/ConfirmationModal';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState<Movie | null>(null);

  const handleRemoveClick = (movie: Movie) => {
    setMovieToRemove(movie);
    setModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (movieToRemove) {
      dispatch(removeFromFavorites(movieToRemove.id));
      setModalOpen(false);
      setMovieToRemove(null);
    }
  };

  const handleCompareClick = (movie: Movie) => {
    dispatch(addToComparison(movie));
    navigate('/');
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  if (favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          На главную
        </Button>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            У вас пока нет избранных фильмов
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Перейти к списку фильмов
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mr: 2 }}>
          Назад
        </Button>
        <Typography variant="h4" component="h1">
          Избранные фильмы ({favorites.length})
        </Typography>
      </Box>

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
        {favorites.map(movie => (
          <Box key={movie.id}>
            <MovieCard
              movie={movie}
              isFavorite={true}
              onFavoriteClick={() => handleRemoveClick(movie)}
              onCompareClick={handleCompareClick}
              onClick={() => handleMovieClick(movie.id)}
            />
          </Box>
        ))}
      </Box>

      <ConfirmationModal
        open={modalOpen}
        title="Удаление из избранного"
        message={`Вы уверены, что хотите удалить фильм "${movieToRemove?.name}" из избранного?`}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setModalOpen(false);
          setMovieToRemove(null);
        }}
      />
    </Container>
  );
};