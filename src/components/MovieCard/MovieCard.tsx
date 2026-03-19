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
import './MovieCard.css'; 

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

  const genres = movie.genres || [];
  const rating = movie.rating?.kp || 0;
  const posterUrl = movie.poster?.previewUrl || movie.poster?.url;

  return (
    <Card className="movie-card" onClick={onClick}>
      {posterUrl ? (
        <CardMedia
          className="movie-card-media"
          component="img"
          image={posterUrl}
          alt={movie.name || 'Фильм'}
        />
      ) : (
        <Box className="movie-card-placeholder">
          {movie.name?.[0] || '?'}
        </Box>
      )}
      
      <CardContent className="movie-card-content">
        <Typography className="movie-card-title" variant="h6" component="h3" noWrap>
          {movie.name || 'Без названия'}
        </Typography>
        
        <Box className="movie-card-info">
          <Chip 
            className="movie-card-chip"
            label={movie.year || 'N/A'} 
            size="small" 
          />
          <Chip
            className={`movie-card-chip ${rating > 7 ? 'rating-high' : ''}`}
            label={`⭐ ${rating.toFixed(1)}`}
            size="small"
          />
        </Box>
        
        <Box className="movie-card-genres">
          {genres.slice(0, 2).map((genre, index) => (
            <Chip
              key={index}
              className="movie-card-genre-chip"
              label={genre.name || 'Жанр'}
              size="small"
            />
          ))}
        </Box>
      </CardContent>

      <Box className="movie-card-actions">
        <IconButton 
          className={`movie-card-action-button ${isFavorite ? 'favorite-active' : ''}`}
          size="small" 
          onClick={handleFavoriteClick}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton 
          className="movie-card-action-button"
          size="small" 
          onClick={handleCompareClick}
        >
          <CompareIcon />
        </IconButton>
      </Box>
    </Card>
  );
};