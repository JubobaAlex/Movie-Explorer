import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Badge, Container } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CompareIcon from '@mui/icons-material/Compare';
import { useAppSelector } from './hooks/reduxHooks';

import { MainPage } from './pages/MainPage/MainPage';
import { MovieDetailPage } from './pages/MovieDetailPage/MovieDetailPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { ComparisonPage } from './pages/ComparisonPage/ComparisonPage';

function App() {
  const favoritesCount = useAppSelector((state) => state.favorites.length);
  const comparisonCount = useAppSelector((state) => state.comparison.length);

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <MovieIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Movie Explorer
            </Link>
          </Typography>
          <Button color="inherit" component={Link} to="/favorites">
            <Badge badgeContent={favoritesCount} color="error">
              <FavoriteIcon />
            </Badge>
          </Button>
          <Button color="inherit" component={Link} to="/compare">
            <Badge badgeContent={comparisonCount} color="error">
              <CompareIcon />
            </Badge>
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;