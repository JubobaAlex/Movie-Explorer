import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { clearComparison } from '../../store/slices/comparisonSlice';
import { Movie } from '../../types';

export const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.comparison);

  if (movies.length < 2) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          На главную
        </Button>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Выберите минимум 2 фильма для сравнения
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Выбрать фильмы
          </Button>
        </Paper>
      </Container>
    );
  }

  const renderMovieCell = (movie: Movie, field: string) => {
    switch (field) {
      case 'name':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={movie.poster?.previewUrl} sx={{ width: 40, height: 40 }} />
            <Typography variant="subtitle1">{movie.name}</Typography>
          </Box>
        );
      case 'year':
        return movie.year;
      case 'rating':
        return (
          <Chip
            label={`⭐ ${movie.rating.kp?.toFixed(1)}`}
            color={movie.rating.kp > 7 ? 'success' : 'default'}
          />
        );
      case 'genres':
        return movie.genres.map(g => g.name).join(', ');
      case 'movieLength':
        return movie.movieLength ? `${movie.movieLength} мин` : 'Н/Д';
      default:
        return 'Н/Д';
    }
  };

  const comparisonFields = [
    { label: 'Название', field: 'name' },
    { label: 'Год выпуска', field: 'year' },
    { label: 'Рейтинг', field: 'rating' },
    { label: 'Жанры', field: 'genres' },
    { label: 'Длительность', field: 'movieLength' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mr: 2 }}>
            Назад
          </Button>
          <Typography variant="h4" component="h1">
            Сравнение фильмов
          </Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={() => dispatch(clearComparison())}>
          Очистить список
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {comparisonFields.map(({ label, field }) => (
              <TableRow key={field}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '200px' }}>
                  {label}
                </TableCell>
                {movies.map((movie) => (
                  <TableCell key={`${movie.id}-${field}`}>
                    {renderMovieCell(movie, field)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};