import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareIcon from '@mui/icons-material/Compare';
import { Movie } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ComparisonBarProps {
  movies: Movie[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  movies,
  onRemove,
  onClear,
}) => {
  const navigate = useNavigate();

  if (movies.length === 0) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        backgroundColor: 'primary.main',
        color: 'white',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CompareIcon />
        <Typography>Сравнение фильмов ({movies.length}/2)</Typography>
        <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
          {movies.map(movie => (
            <Chip
              key={movie.id}
              avatar={
                <Avatar src={movie.poster?.previewUrl}>
                  {movie.name[0]}
                </Avatar>
              }
              label={movie.name}
              onDelete={() => onRemove(movie.id)}
              deleteIcon={<CloseIcon />}
              sx={{ backgroundColor: 'white', color: 'primary.main' }}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/compare')}
          disabled={movies.length < 2}
        >
          Сравнить
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClear}>
          Очистить
        </Button>
      </Box>
    </Paper>
  );
};