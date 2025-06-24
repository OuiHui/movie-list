import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Star } from 'lucide-react';
import DragDropCards from './components/DragDropCards';

const MovieListApp = () => {
  const [movies, setMovies] = useState([
    { id: 1, title: "The Godfather", year: 1972, genre: "Crime", rating: 9.2, poster: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son." },
    { id: 2, title: "Pulp Fiction", year: 1994, genre: "Crime", rating: 8.9, poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption." },
    { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0, poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests." },
    { id: 4, title: "Schindler's List", year: 1993, genre: "Drama", rating: 9.0, poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution." },
    { id: 5, title: "Forrest Gump", year: 1994, genre: "Drama", rating: 8.8, poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75." }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [newMovie, setNewMovie] = useState({
    title: '',
    year: '',
    genre: '',
    rating: '',
    poster: '',
    description: ''
  });

  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.year.toString().includes(searchTerm)
    );
    setFilteredMovies(filtered);
  }, [movies, searchTerm]);

  const addMovie = () => {
    if (newMovie.title && newMovie.year) {
      const movie = {
        id: Date.now(),
        title: newMovie.title,
        year: parseInt(newMovie.year),
        genre: newMovie.genre || 'Unknown',
        rating: parseFloat(newMovie.rating) || 0,
        poster: newMovie.poster || `https://via.placeholder.com/200x300/333/fff?text=${encodeURIComponent(newMovie.title)}`,
        description: newMovie.description || 'No description available.'
      };
      setMovies([...movies, movie]);
      setNewMovie({ title: '', year: '', genre: '', rating: '', poster: '', description: '' });
      setIsModalOpen(false);
    }
  };

  const openMovieDetail = (movie) => {
    setSelectedMovie(movie);
    setIsDetailModalOpen(true);
  };

  const removeMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Top 100 Movies</h1>
        <div style={styles.headerControls}>
          <div style={styles.searchContainer}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={styles.addButton}
          >
            <Plus size={20} />
            Add Movie
          </button>
        </div>
      </header>

      <div style={styles.movieGrid}>
        {filteredMovies.map((movie, index) => (
          <div key={movie.id} style={styles.movieCard} onClick={() => openMovieDetail(movie)}>
            <div style={styles.movieRank}>#{index + 1}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeMovie(movie.id);
              }}
              style={styles.removeButton}
            >
              <X size={16} />
            </button>
            <img
              src={movie.poster}
              alt={movie.title}
              style={styles.moviePoster}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/200x300/333/fff?text=${encodeURIComponent(movie.title)}`;
              }}
            />
            <div style={styles.movieInfo}>
              <h3 style={styles.movieTitle}>{movie.title}</h3>
              <p style={styles.movieYear}>{movie.year}</p>
              <p style={styles.movieGenre}>{movie.genre}</p>
              <div style={styles.movieRating}>
                <Star size={16} fill="#ffd700" color="#ffd700" />
                <span>{movie.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drag and Drop Cards Section */}
      <div style={styles.dragDropSection}>
        <DragDropCards />
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Movie</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                  style={styles.input}
                  placeholder="Enter movie title"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Year *</label>
                <input
                  type="number"
                  value={newMovie.year}
                  onChange={(e) => setNewMovie({...newMovie, year: e.target.value})}
                  style={styles.input}
                  placeholder="Enter release year"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Genre</label>
                <input
                  type="text"
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                  style={styles.input}
                  placeholder="Enter genre"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newMovie.rating}
                  onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                  style={styles.input}
                  placeholder="Enter rating (0-10)"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Poster URL</label>
                <input
                  type="url"
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({...newMovie, poster: e.target.value})}
                  style={styles.input}
                  placeholder="Enter poster image URL"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                  style={{...styles.input, height: '80px', resize: 'vertical'}}
                  placeholder="Enter movie description"
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={addMovie}
                style={styles.saveButton}
                disabled={!newMovie.title || !newMovie.year}
              >
                Add Movie
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedMovie && (
        <div style={styles.modalOverlay} onClick={() => setIsDetailModalOpen(false)}>
          <div style={styles.detailModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedMovie.title}</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} />
              </button>
            </div>
            <div style={styles.detailModalBody}>
              <div style={styles.detailContent}>
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  style={styles.detailPoster}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(selectedMovie.title)}`;
                  }}
                />
                <div style={styles.detailInfo}>
                  <div style={styles.detailMetadata}>
                    <p style={styles.detailYear}><strong>Year:</strong> {selectedMovie.year}</p>
                    <p style={styles.detailGenre}><strong>Genre:</strong> {selectedMovie.genre}</p>
                    <div style={styles.detailRating}>
                      <strong>Rating:</strong>
                      <div style={styles.ratingContainer}>
                        <Star size={20} fill="#ffd700" color="#ffd700" />
                        <span style={styles.ratingText}>{selectedMovie.rating}/10</span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.descriptionSection}>
                    <h3 style={styles.descriptionTitle}>Description</h3>
                    <p style={styles.descriptionText}>{selectedMovie.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    padding: '2rem',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#888',
    zIndex: 1
  },
  searchInput: {
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '2px solid #333',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '16px',
    width: '300px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#4ecdc4',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#45b7b8',
      transform: 'translateY(-2px)'
    }
  },
  movieGrid: {
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '2rem'
  },
  movieCard: {
    position: 'relative',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }
  },
  movieRank: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#4ecdc4',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 2
  },
  removeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'background-color 0.2s'
  },
  moviePoster: {
    width: '100%',
    height: '300px',
    objectFit: 'cover'
  },
  movieInfo: {
    padding: '1rem'
  },
  movieTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    lineHeight: '1.3'
  },
  movieYear: {
    color: '#888',
    margin: '0 0 0.25rem 0',
    fontSize: '0.9rem'
  },
  movieGenre: {
    color: '#4ecdc4',
    margin: '0 0 0.5rem 0',
    fontSize: '0.85rem'
  },
  movieRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.9rem'
  },
  dragDropSection: {
    borderTop: '1px solid #333',
    paddingTop: '2rem',
    marginTop: '2rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #333'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #333'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#4ecdc4'
  },
  modalCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s'
  },
  modalBody: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#fff'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #333',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    padding: '1.5rem',
    borderTop: '1px solid #333'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#888',
    border: '2px solid #333',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#4ecdc4',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    opacity: 1
  },
  detailModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #333'
  },
  detailModalBody: {
    padding: '1.5rem'
  },
  detailContent: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  detailPoster: {
    width: '300px',
    height: '450px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0
  },
  detailInfo: {
    flex: 1,
    minWidth: '300px'
  },
  detailMetadata: {
    marginBottom: '2rem'
  },
  detailYear: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#fff'
  },
  detailGenre: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#fff'
  },
  detailRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
    color: '#fff'
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  ratingText: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  descriptionSection: {
    marginTop: '1rem'
  },
  descriptionTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: '0 0 1rem 0',
    color: '#4ecdc4'
  },
  descriptionText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#ccc',
    margin: 0
  }
};

// Add hover effects via CSS-in-JS workaround
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .movie-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .add-button:hover {
    background-color: #45b7b8 !important;
    transform: translateY(-2px);
  }
  .search-input:focus {
    border-color: #4ecdc4 !important;
  }
  .input:focus {
    border-color: #4ecdc4 !important;
  }
  .modal-close-button:hover {
    color: #fff !important;
  }
  .cancel-button:hover {
    border-color: #888 !important;
    color: #fff !important;
  }
  .save-button:hover {
    background-color: #45b7b8 !important;
  }
  .save-button:disabled {
    background-color: #333 !important;
    color: #666 !important;
    cursor: not-allowed !important;
  }
  .remove-button:hover {
    background-color: rgba(255, 107, 107, 1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default MovieListApp;