import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Slider,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Filters } from '../../types';

const GENRES = [
  'боевик', 'фантастика', 'комедия', 'драма', 'ужасы',
  'триллер', 'мелодрама', 'детектив', 'приключения', 'фэнтези',
];

interface MovieFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleGenreToggle = (genre: string) => {
    const newGenres = localFilters.genres.includes(genre)
      ? localFilters.genres.filter(g => g !== genre)
      : [...localFilters.genres, genre];
    
    setLocalFilters({ ...localFilters, genres: newGenres });
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    setLocalFilters({ ...localFilters, rating: newValue as [number, number] });
  };

  const handleYearChange = (event: Event, newValue: number | number[]) => {
    setLocalFilters({ ...localFilters, year: newValue as [number, number] });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      genres: [],
      rating: [0, 10] as [number, number],
      year: [1990, new Date().getFullYear()] as [number, number],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Фильтры</Typography>
        <IconButton onClick={() => setOpen(!open)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Жанры</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {GENRES.map(genre => (
              <Chip
                key={genre}
                label={genre}
                onClick={() => handleGenreToggle(genre)}
                color={localFilters.genres.includes(genre) ? 'primary' : 'default'}
                variant={localFilters.genres.includes(genre) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          <Typography gutterBottom>Рейтинг</Typography>
          <Box sx={{ px: 2, mb: 3 }}>
            <Slider
              value={localFilters.rating}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
          </Box>

          <Typography gutterBottom>Год выпуска</Typography>
          <Box sx={{ px: 2, mb: 3 }}>
            <Slider
              value={localFilters.year}
              onChange={handleYearChange}
              valueLabelDisplay="auto"
              min={1990}
              max={new Date().getFullYear()}
              step={1}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleApply} fullWidth>
              Применить
            </Button>
            <Button variant="outlined" onClick={handleReset} fullWidth>
              Сбросить
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};