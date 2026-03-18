import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareIcon from '@mui/icons-material/Compare';
import { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onFavoriteClick?: (movie: Movie) => void;
  onCompareClick?: (movie: Movie) => void;
  onClick?: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onFavoriteClick,
  onCompareClick,
  onClick,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(movie);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompareClick?.(movie);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="300"
        image={movie.poster?.previewUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
        alt={movie.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h3" noWrap>
          {movie.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip label={movie.year} size="small" />
          <Chip
            label={`⭐ ${movie.rating.kp?.toFixed(1) || 'N/A'}`}
            size="small"
            color={movie.rating.kp > 7 ? 'success' : 'default'}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {movie.genres.slice(0, 2).map(genre => (
            <Chip key={genre.name} label={genre.name} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          gap: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 1,
          p: 0.5,
        }}
      >
        <IconButton size="small" onClick={handleFavoriteClick} sx={{ color: 'white' }}>
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton size="small" onClick={handleCompareClick} sx={{ color: 'white' }}>
          <CompareIcon />
        </IconButton>
      </Box>
    </Card>
  );
};