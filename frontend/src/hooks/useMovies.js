import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/movies` : 'http://localhost:5000/api/movies';

export const useMovies = (currentListId) => {
  const [movies, setMovies] = useState([]);
  const [dragCards, setDragCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch movies when currentListId changes
  useEffect(() => {
    if (currentListId) {
      fetchMovies(currentListId);
    }
  }, [currentListId]);

  // Fetch movies from the backend
  const fetchMovies = async (listId) => {
    setLoading(true);
    setError(null);
    try {
      const url = listId ? `${API_BASE_URL}?listId=${listId}` : API_BASE_URL;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Convert MongoDB _id to id for frontend compatibility
        const moviesWithId = data.data.map(movie => ({
          ...movie,
          id: movie._id
        }));
        setMovies(moviesWithId);
      } else {
        throw new Error(data.message || 'Failed to fetch movies');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching movies:', err);
      // Clear movies on error
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize drag cards when movies change
  useEffect(() => {
    const cards = movies.map((movie, index) => ({
      id: movie.id,
      title: `#${index + 1} - ${movie.title}`,
      content: `${movie.year} • ${movie.genre} • ⭐${movie.rating}`
    }));
    setDragCards(cards);
  }, [movies]);

  // Filter movies when search term changes
  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.year.toString().includes(searchTerm)
    );
    setFilteredMovies(filtered);
  }, [movies, searchTerm]);

  const addMovie = async (movieData, listId) => {
    // Validate required fields including poster
    if (!movieData.title || !movieData.poster) {
      throw new Error('Title and poster are required fields');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: movieData.title,
          year: parseInt(movieData.year) || 0,
          genre: movieData.genre || 'Unknown',
          rating: parseFloat(movieData.rating) || 0,
          poster: movieData.poster,
          description: movieData.description || 'No description available.',
          personalNote: movieData.personalNote || '',
          rank: movies.length + 1,
          listId: listId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Add id field for frontend compatibility
        const newMovie = { ...data.data, id: data.data._id };
        setMovies(prevMovies => [...prevMovies, newMovie]);
      } else {
        throw new Error(data.message || 'Failed to add movie');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMovie = async (id, movieData) => {
    // Validate required fields including poster
    if (!movieData.title || !movieData.poster) {
      throw new Error('Title and poster are required fields');
    }

    setLoading(true);
    setError(null);
    
    // Find current movie to preserve rank
    const currentMovie = movies.find(m => m.id.toString() === id.toString());
    const currentRank = currentMovie ? currentMovie.rank : 0;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: movieData.title,
          year: parseInt(movieData.year) || 0,
          genre: movieData.genre || 'Unknown',
          rating: parseFloat(movieData.rating) || 0,
          poster: movieData.poster,
          description: movieData.description || 'No description available.',
          personalNote: movieData.personalNote || '',
          rank: currentRank
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update movie in local state
        const updatedMovie = { ...data.data, id: data.data._id };
        setMovies(prevMovies => 
          prevMovies.map(movie => movie.id === id ? updatedMovie : movie)
        );
      } else {
        throw new Error(data.message || 'Failed to update movie');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMovie = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove movie from local state
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
      } else {
        throw new Error(data.message || 'Failed to delete movie');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting movie:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDragCardReorder = async (reorderedCards, listId) => {
    setDragCards(reorderedCards);
    
    // Reorder movies to match the drag cards order
    const reorderedMovies = reorderedCards.map(card => 
      movies.find(movie => movie.id.toString() === card.id.toString())
    ).filter(Boolean);
    
    // Update local state immediately for responsive UI
    setMovies(reorderedMovies);
    
    // Persist rankings to database
    try {
      await updateRankings(reorderedMovies, listId);
      toast.success('Rankings saved!');
    } catch (error) {
      console.error('Failed to save rankings:', error);
      toast.error('Failed to save rankings to database');
    }
  };

  // Update rankings in database
  const updateRankings = async (reorderedMovies, listId) => {
    setLoading(true);
    setError(null);

    try {
      const rankings = reorderedMovies.map((movie, index) => ({
        id: movie.id,
        rank: index + 1
      }));

      const response = await fetch(`${API_BASE_URL}/rankings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rankings, listId }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state with new rankings
        const updatedMovies = reorderedMovies.map((movie, index) => ({
          ...movie,
          rank: index + 1
        }));
        setMovies(updatedMovies);
      } else {
        throw new Error(data.message || 'Failed to update rankings');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating rankings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    movies,
    dragCards,
    searchTerm,
    filteredMovies,
    loading,
    error,
    setSearchTerm,
    addMovie,
    updateMovie,
    removeMovie,
    handleDragCardReorder,
    updateRankings,
    refetchMovies: () => fetchMovies(currentListId)
  };
};
