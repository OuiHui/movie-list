import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Film, TrendingUp } from 'lucide-react';
import { movieApi } from '../services/movieApi';
import { toast } from 'react-hot-toast';

const MovieSearchModal = ({ isOpen, onClose, onSelectMovie }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopular, setShowPopular] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Load popular movies when modal opens
  useEffect(() => {
    if (isOpen && popularMovies.length === 0) {
      loadPopularMovies();
    }
  }, [isOpen]);

  // Search movies when search term changes
  useEffect(() => {
    if (searchTerm.trim() && searchTerm.length > 2) {
      setShowPopular(false);
      const delayedSearch = setTimeout(async () => {
        setLoading(true);
        setError(null);
        try {
          const results = await movieApi.searchMovies(searchTerm);
          setSearchResults(results);
          // Check if we're in demo mode (no API key)
          if (!import.meta.env.VITE_TMDB_API_KEY) {
            setIsDemo(true);
          }
        } catch (err) {
          if (err.message.includes('API key')) {
            setIsDemo(true);
            setError('Using demo data. Add your TMDb API key to access real movie data.');
          } else {
            setError('Failed to search movies. Please check your API key and try again.');
          }
          toast.error('Failed to search movies');
        } finally {
          setLoading(false);
        }
      }, 500);

      return () => clearTimeout(delayedSearch);
    } else {
      setSearchResults([]);
      setShowPopular(true);
    }
  }, [searchTerm]);

  const loadPopularMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const movies = await movieApi.getPopularMovies();
      setPopularMovies(movies);
      // Check if we're in demo mode (no API key)
      if (!import.meta.env.VITE_TMDB_API_KEY) {
        setIsDemo(true);
      }
    } catch (err) {
      if (err.message.includes('API key')) {
        setIsDemo(true);
        setError('Using demo data. Add your TMDb API key to access real movie data.');
      } else {
        setError('Failed to load popular movies. Please check your API key.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = (movie) => {
    onSelectMovie(movie);
    onClose();
    setSearchTerm('');
    setSearchResults([]);
    toast.success(`Selected "${movie.title}"`);
  };

  const handleClose = () => {
    onClose();
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
    setShowPopular(true);
    setIsDemo(false);
  };

  if (!isOpen) return null;

  const moviesToShow = showPopular ? popularMovies : searchResults;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="movie-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <Film size={24} className="modal-icon" />
            <h2 className="modal-title">
              {showPopular ? 'Popular Movies' : 'Search Results'}
              {isDemo && <span className="demo-badge">Demo</span>}
            </h2>
          </div>
          <button onClick={handleClose} className="modal-close-button">
            <X size={24} />
          </button>
        </div>

        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-modal"
            autoFocus
          />
        </div>

        {isDemo && (
          <div className="demo-notice">
            <p>🎬 You're using demo data. Add your TMDb API key to access real movie data.</p>
          </div>
        )}

        {showPopular && !loading && (
          <div className="popular-header">
            <TrendingUp size={18} />
            <span>Popular Movies Right Now</span>
          </div>
        )}

        <div className="search-results">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{showPopular ? 'Loading popular movies...' : 'Searching movies...'}</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              {error.includes('API key') && (
                <div className="api-key-help">
                  <p>To use movie search:</p>
                  <ol>
                    <li>Get a free API key from <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb</a></li>
                    <li>Add <code>VITE_TMDB_API_KEY=your_key_here</code> to your .env file</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {moviesToShow.length === 0 && searchTerm.length > 2 && !loading && !error && (
            <div className="no-results">
              <p>No movies found for "{searchTerm}"</p>
              <p>Try a different search term</p>
            </div>
          )}

          {moviesToShow.map((movie) => (
            <div key={movie.tmdbId} className="search-result-item">
              <img
                src={movie.poster || `https://via.placeholder.com/92x138/333/fff?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="search-result-poster"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/92x138/333/fff?text=${encodeURIComponent(movie.title)}`;
                }}
              />
              <div className="search-result-info">
                <h3 className="search-result-title">{movie.title}</h3>
                <div className="search-result-meta">
                  <span className="search-result-year">{movie.year}</span>
                  <span className="search-result-separator">•</span>
                  <span className="search-result-genre">{movie.genre}</span>
                  <span className="search-result-separator">•</span>
                  <span className="search-result-rating">⭐ {movie.rating}/10</span>
                </div>
                <p className="search-result-description">
                  {movie.description.length > 150 
                    ? `${movie.description.substring(0, 150)}...` 
                    : movie.description}
                </p>
              </div>
              <button
                className="search-result-add-button"
                onClick={() => handleSelectMovie(movie)}
                title="Add this movie"
              >
                <Plus size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSearchModal;
