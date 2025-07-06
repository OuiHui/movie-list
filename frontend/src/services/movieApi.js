const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Demo data for when API key is not available
const demoMovies = [
  {
    tmdbId: 'demo-1',
    title: 'The Matrix',
    year: 1999,
    genre: 'Science Fiction',
    rating: 8.7,
    poster: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=The+Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    personalNote: ''
  },
  {
    tmdbId: 'demo-2',
    title: 'Pulp Fiction',
    year: 1994,
    genre: 'Crime',
    rating: 8.9,
    poster: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=Pulp+Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    personalNote: ''
  },
  {
    tmdbId: 'demo-3',
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action',
    rating: 9.0,
    poster: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=The+Dark+Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    personalNote: ''
  },
  {
    tmdbId: 'demo-4',
    title: 'Forrest Gump',
    year: 1994,
    genre: 'Drama',
    rating: 8.8,
    poster: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=Forrest+Gump',
    description: 'The presidencies of Kennedy and Johnson through the eyes of Alabama man Forrest Gump, a man with a low IQ but a good heart.',
    personalNote: ''
  },
  {
    tmdbId: 'demo-5',
    title: 'Inception',
    year: 2010,
    genre: 'Science Fiction',
    rating: 8.8,
    poster: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into a CEO\'s mind.',
    personalNote: ''
  }
];

export const movieApi = {
  // Search for movies
  searchMovies: async (query) => {
    if (!TMDB_API_KEY) {
      // Return demo data filtered by query
      const filteredMovies = demoMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return filteredMovies;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }
      
      const data = await response.json();
      
      // Transform TMDb data to your app format
      return data.results.map(movie => ({
        tmdbId: movie.id,
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : '',
        genre: movie.genre_ids.length > 0 ? getGenreName(movie.genre_ids[0]) : 'Unknown',
        rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
        description: movie.overview || 'No description available.',
        personalNote: ''
      }));
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details by ID
  getMovieDetails: async (tmdbId) => {
    if (!TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured');
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get movie details');
      }
      
      const movie = await response.json();
      
      return {
        tmdbId: movie.id,
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : '',
        genre: movie.genres.length > 0 ? movie.genres[0].name : 'Unknown',
        rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
        description: movie.overview || 'No description available.',
        personalNote: ''
      };
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopularMovies: async () => {
    if (!TMDB_API_KEY) {
      // Return demo data
      await new Promise(resolve => setTimeout(resolve, 500));
      return demoMovies;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get popular movies');
      }
      
      const data = await response.json();
      
      return data.results.slice(0, 10).map(movie => ({
        tmdbId: movie.id,
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : '',
        genre: movie.genre_ids.length > 0 ? getGenreName(movie.genre_ids[0]) : 'Unknown',
        rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
        description: movie.overview || 'No description available.',
        personalNote: ''
      }));
    } catch (error) {
      console.error('Error getting popular movies:', error);
      throw error;
    }
  }
};

// Genre mapping (TMDb genre IDs to names)
const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

const getGenreName = (genreId) => {
  return genreMap[genreId] || 'Unknown';
};
