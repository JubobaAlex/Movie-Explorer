import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareIcon from '@mui/icons-material/Compare';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { getMovieById } from '../../api/kinopoiskApi';
import { Movie } from '../../types';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { addToComparison } from '../../store/slices/comparisonSlice';
import { ConfirmationModal } from '../../components/Modal/ConfirmationModal';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const favorites = useAppSelector((state) => state.favorites);
  const isFavorite = movie ? favorites.some(m => m.id === movie.id) : false;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieById(Number(id));
        setMovie(data);
      } catch (err) {
        setError('Не удалось загрузить информацию о фильме');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleFavoriteClick = () => {
    if (!movie) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      setModalOpen(true);
    }
  };

  const handleConfirmFavorite = () => {
    if (movie) {
      dispatch(addToFavorites(movie));
      setModalOpen(false);
    }
  };

  const handleCompareClick = () => {
    if (movie) {
      dispatch(addToComparison(movie));
      navigate('/');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Фильм не найден'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Вернуться на главную
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Назад к списку
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: { md: '0 0 33.333%' } }}>
            <Box
              component="img"
              src={movie.poster?.url || 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Box>

          <Box sx={{ flex: { md: '0 0 66.666%' } }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {movie.name}
            </Typography>

            {movie.alternativeName && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {movie.alternativeName}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip label={`Год: ${movie.year}`} />
              {movie.movieLength && (
                <Chip label={`Длительность: ${movie.movieLength} мин`} />
              )}
              {movie.ageRating && (
                <Chip label={`${movie.ageRating}+`} color="secondary" />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" component="span" color="primary">
                ⭐ {movie.rating.kp?.toFixed(1)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleFavoriteClick}
                color={isFavorite ? 'error' : 'primary'}
              >
                {isFavorite ? 'В избранном' : 'В избранное'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CompareIcon />}
                onClick={handleCompareClick}
              >
                Сравнить
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" gutterBottom>
              О фильме
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.description || movie.shortDescription || 'Описание отсутствует'}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Жанры
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.genres.map(genre => (
                  <Chip key={genre.name} label={genre.name} />
                ))}
              </Box>
            </Box>

            {movie.countries && movie.countries.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Страны
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {movie.countries.map(country => (
                    <Chip key={country.name} label={country.name} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      <ConfirmationModal
        open={modalOpen}
        title="Добавление в избранное"
        message={`Вы уверены, что хотите добавить фильм "${movie.name}" в избранное?`}
        onConfirm={handleConfirmFavorite}
        onCancel={() => setModalOpen(false)}
      />
    </Container>
  );
};