import { useState, useEffect } from 'react';

export const useMovies = () => {
  const [movies, setMovies] = useState([
    { 
      id: 1, 
      title: "The Godfather", 
      year: 1972, 
      genre: "Crime", 
      rating: 9.2, 
      poster: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", 
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son." 
    },
    { 
      id: 2, 
      title: "Pulp Fiction", 
      year: 1994, 
      genre: "Crime", 
      rating: 8.9, 
      poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", 
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption." 
    },
    { 
      id: 3, 
      title: "The Dark Knight", 
      year: 2008, 
      genre: "Action", 
      rating: 9.0, 
      poster: "https://musicart.xboxlive.com/7/abb02f00-0000-0000-0000-000000000002/504/image.jpg", 
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests." 
    },
    { 
      id: 4, 
      title: "Schindler's List", 
      year: 1993, 
      genre: "Drama", 
      rating: 9.0, 
      poster: "https://m.media-amazon.com/images/M/MV5BNjM1ZDQxYWUtMzQyZS00MTE1LWJmZGYtNGUyNTdlYjM3ZmVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", 
      description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution." 
    },
    { 
      id: 5, 
      title: "Forrest Gump", 
      year: 1994, 
      genre: "Drama", 
      rating: 8.8, 
      poster: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", 
      description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75." 
    }
  ]);

  const [dragCards, setDragCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movies);

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

  const addMovie = (movieData) => {
    // Validate required fields including poster
    if (!movieData.title || !movieData.year || !movieData.poster) {
      throw new Error('Title, year, and poster are required fields');
    }

    const movie = {
      id: Date.now(),
      title: movieData.title,
      year: parseInt(movieData.year),
      genre: movieData.genre || 'Unknown',
      rating: parseFloat(movieData.rating) || 0,
      poster: movieData.poster,
      description: movieData.description || 'No description available.'
    };
    setMovies([...movies, movie]);
  };

  const updateMovie = (id, movieData) => {
    // Validate required fields including poster
    if (!movieData.title || !movieData.year || !movieData.poster) {
      throw new Error('Title, year, and poster are required fields');
    }

    const updatedMovie = {
      id,
      title: movieData.title,
      year: parseInt(movieData.year),
      genre: movieData.genre || 'Unknown',
      rating: parseFloat(movieData.rating) || 0,
      poster: movieData.poster,
      description: movieData.description || 'No description available.'
    };
    setMovies(movies.map(movie => movie.id === id ? updatedMovie : movie));
  };

  const removeMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  const handleDragCardReorder = (reorderedCards) => {
    setDragCards(reorderedCards);
    
    // Reorder movies to match the drag cards order
    const reorderedMovies = reorderedCards.map(card => 
      movies.find(movie => movie.id === card.id)
    ).filter(Boolean);
    
    setMovies(reorderedMovies);
  };

  return {
    movies,
    dragCards,
    searchTerm,
    filteredMovies,
    setSearchTerm,
    addMovie,
    updateMovie,
    removeMovie,
    handleDragCardReorder
  };
};
