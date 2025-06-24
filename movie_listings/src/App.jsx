import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Star } from 'lucide-react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import './App.css';

const MovieListApp = () => {
  const [movies, setMovies] = useState([
    { id: 1, title: "The Godfather", year: 1972, genre: "Crime", rating: 9.2, poster: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son." },
    { id: 2, title: "Pulp Fiction", year: 1994, genre: "Crime", rating: 8.9, poster: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption." },
    { id: 3, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0, poster: "https://musicart.xboxlive.com/7/abb02f00-0000-0000-0000-000000000002/504/image.jpg", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests." },
    { id: 4, title: "Schindler's List", year: 1993, genre: "Drama", rating: 9.0, poster: "https://m.media-amazon.com/images/M/MV5BNjM1ZDQxYWUtMzQyZS00MTE1LWJmZGYtNGUyNTdlYjM3ZmVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution." },
    { id: 5, title: "Forrest Gump", year: 1994, genre: "Drama", rating: 8.8, poster: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75." }
  ]);
  
  // Create drag cards that correspond to movies
  const [dragCards, setDragCards] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [newMovie, setNewMovie] = useState({
    title: '',
    year: '',
    genre: '',
    rating: '',
    poster: '',
    description: ''
  });
  const [editMovie, setEditMovie] = useState({
    id: null,
    title: '',
    year: '',
    genre: '',
    rating: '',
    poster: '',
    description: ''
  });

  // Initialize drag cards when movies change
  useEffect(() => {
    const cards = movies.map((movie, index) => ({
      id: movie.id,
      title: `#${index + 1} - ${movie.title}`,
      content: `${movie.year} • ${movie.genre} • ⭐${movie.rating}`
    }));
    setDragCards(cards);
  }, [movies]);

  // Handle reordering of drag cards and sync with movies
  const handleDragCardReorder = (reorderedCards) => {
    setDragCards(reorderedCards);
    
    // Reorder movies to match the drag cards order
    const reorderedMovies = reorderedCards.map(card => 
      movies.find(movie => movie.id === card.id)
    ).filter(Boolean);
    
    setMovies(reorderedMovies);
  };

  // Drag and drop state
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const draggedCardRef = useRef(null);
  const draggedOverIndexRef = useRef(null);

  // Drag and drop handlers
  const handleMouseDown = (e, card) => {
    e.preventDefault();
    setDraggedCard(card);
    draggedCardRef.current = card;
    setIsDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const cardElement = elements.find(el => el.classList.contains('drag-card-item') && !el.classList.contains('dragging'));
      
      if (cardElement) {
        const cardId = parseInt(cardElement.dataset.cardId);
        const cardIndex = dragCards.findIndex(c => c.id === cardId);
        
        if (cardIndex !== -1 && cardId !== card.id) {
          const rect = cardElement.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          const dropIndex = e.clientY < midpoint ? cardIndex : cardIndex + 1;
          setDraggedOverIndex(dropIndex);
          draggedOverIndexRef.current = dropIndex;
        }
      } else {
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          if (e.clientY > containerRect.bottom - 50) {
            setDraggedOverIndex(dragCards.length);
          }
        }
      }
    };

    const handleMouseUp = () => {
      const overIndex = draggedOverIndexRef.current;
      const cardRef = draggedCardRef.current;
      if (overIndex !== null && cardRef) {
        const currentIndex = dragCards.findIndex(c => c.id === cardRef.id);
        if (currentIndex !== -1 && overIndex !== currentIndex) {
          const updated = Array.from(dragCards);
          const [moved] = updated.splice(currentIndex, 1);
          const adjustedIndex = overIndex > currentIndex ? overIndex - 1 : overIndex;
          updated.splice(adjustedIndex, 0, moved);
          handleDragCardReorder(updated);
        }
      }
      draggedCardRef.current = null;
      draggedOverIndexRef.current = null;
      setDraggedCard(null);
      setDraggedOverIndex(null);
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setEditMovie({
      id: movie.id,
      title: movie.title,
      year: movie.year.toString(),
      genre: movie.genre,
      rating: movie.rating.toString(),
      poster: movie.poster,
      description: movie.description
    });
    setIsEditModalOpen(true);
  };

  const updateMovie = () => {
    if (editMovie.title && editMovie.year) {
      const updatedMovie = {
        ...editingMovie,
        title: editMovie.title,
        year: parseInt(editMovie.year),
        genre: editMovie.genre || 'Unknown',
        rating: parseFloat(editMovie.rating) || 0,
        poster: editMovie.poster || `https://via.placeholder.com/200x300/333/fff?text=${encodeURIComponent(editMovie.title)}`,
        description: editMovie.description || 'No description available.'
      };
      setMovies(movies.map(movie => movie.id === editingMovie.id ? updatedMovie : movie));
      setIsEditModalOpen(false);
      setEditingMovie(null);
      setEditMovie({
        id: null,
        title: '',
        year: '',
        genre: '',
        rating: '',
        poster: '',
        description: ''
      });
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Top 100 Movies</h1>
        <div className="header-controls">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-button"
          >
            <Plus size={20} />
            Add Movie
          </button>
        </div>
      </header>

      {/* Main Content - Side by Side Layout */}
      <div className="main-content">
        {/* Left Side - Movie Cards */}
        <div className="left-panel">
          <h2 className="panel-title">Movie Collection</h2>
          <div className="movie-grid">
            {filteredMovies.map((movie, index) => (
              <div key={movie.id} className="movie-card" onClick={() => openMovieDetail(movie)}>
                <div className="movie-rank">#{index + 1}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMovie(movie.id);
                  }}
                  className="remove-button"
                  title="Delete movie"
                >
                  <DeleteIcon boxSize="14px" />
                </button>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x300/333/fff?text=${encodeURIComponent(movie.title)}`;
                  }}
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-year">{movie.year}</p>
                  <p className="movie-genre">{movie.genre}</p>
                  <div className="movie-rating">
                    <Star size={16} fill="#ffd700" color="#ffd700" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(movie);
                  }}
                  className="edit-button"
                  title="Edit movie"
                >
                  <EditIcon boxSize="14px" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Drag and Drop Cards */}
        <div className="right-panel">
          <h2 className="panel-title">Ranking Control</h2>
          <p className="panel-subtitle">Drag to reorder your movie rankings</p>
          
          <div ref={containerRef} className="drag-card-container">
            {dragCards.map((card, index) => (
              <React.Fragment key={card.id}>
                {draggedOverIndex === index && draggedCard && <div className="drag-over-indicator" />}
                
                <div
                  className={`drag-card-item${draggedCard && draggedCard.id === card.id ? ' drag-card-item-dragging' : ''}`}
                  data-card-id={card.id}
                >
                  <div className="drag-card-left">
                    <div 
                      onMouseDown={(e) => handleMouseDown(e, card)} 
                      className="drag-icon-wrapper"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="4" cy="4" r="1" fill="#888"/>
                        <circle cx="12" cy="4" r="1" fill="#888"/>
                        <circle cx="4" cy="8" r="1" fill="#888"/>
                        <circle cx="12" cy="8" r="1" fill="#888"/>
                        <circle cx="4" cy="12" r="1" fill="#888"/>
                        <circle cx="12" cy="12" r="1" fill="#888"/>
                      </svg>
                    </div>
                    <div className="drag-card-content">
                      <h3 className="drag-card-title">{card.title}</h3>
                      <p className="drag-card-text">{card.content}</p>
                    </div>
                  </div>
                  <div className="drag-card-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const movie = movies.find(m => m.id === card.id);
                        if (movie) openEditModal(movie);
                      }}
                      className="drag-card-edit-button"
                      title="Edit movie"
                    >
                      <EditIcon boxSize="14px" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMovie(card.id);
                      }}
                      className="drag-card-delete-button"
                      title="Delete movie"
                    >
                      <DeleteIcon boxSize="14px" />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
            
            {draggedOverIndex === dragCards.length && draggedCard && <div className="drag-over-indicator" />}
          </div>
        </div>
      </div>

      {/* Floating dragged card */}
      {isDragging && draggedCard && (
        <div className="floating-card" style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 30
        }}>
          <h3 className="floating-card-title">{draggedCard.title}</h3>
          <p className="floating-card-text">{draggedCard.content}</p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Movie</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close-button"
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label">Title *</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                  className="input"
                  placeholder="Enter movie title"
                />
              </div>
              <div className="form-group">
                <label className="label">Year *</label>
                <input
                  type="number"
                  value={newMovie.year}
                  onChange={(e) => setNewMovie({...newMovie, year: e.target.value})}
                  className="input"
                  placeholder="Enter release year"
                />
              </div>
              <div className="form-group">
                <label className="label">Genre</label>
                <input
                  type="text"
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                  className="input"
                  placeholder="Enter genre"
                />
              </div>
              <div className="form-group">
                <label className="label">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newMovie.rating}
                  onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                  className="input"
                  placeholder="Enter rating (0-10)"
                />
              </div>
              <div className="form-group">
                <label className="label">Poster URL</label>
                <input
                  type="url"
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({...newMovie, poster: e.target.value})}
                  className="input"
                  placeholder="Enter poster image URL"
                />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                  className="input textarea"
                  placeholder="Enter movie description"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={addMovie}
                className="save-button"
                disabled={!newMovie.title || !newMovie.year}
              >
                Add Movie
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedMovie && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedMovie.title}</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="modal-close-button"
              >
                <X size={24} />
              </button>
            </div>
            <div className="detail-modal-body">
              <div className="detail-content">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="detail-poster"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(selectedMovie.title)}`;
                  }}
                />
                <div className="detail-info">
                  <div className="detail-metadata">
                    <p className="detail-year"><strong>Year:</strong> {selectedMovie.year}</p>
                    <p className="detail-genre"><strong>Genre:</strong> {selectedMovie.genre}</p>
                    <div className="detail-rating">
                      <strong>Rating:</strong>
                      <div className="rating-container">
                        <Star size={20} fill="#ffd700" color="#ffd700" />
                        <span className="rating-text">{selectedMovie.rating}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="description-section">
                    <h3 className="description-title">Description</h3>
                    <p className="description-text">{selectedMovie.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingMovie && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Movie</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="modal-close-button"
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label">Title *</label>
                <input
                  type="text"
                  value={editMovie.title}
                  onChange={(e) => setEditMovie({...editMovie, title: e.target.value})}
                  className="input"
                  placeholder="Enter movie title"
                />
              </div>
              <div className="form-group">
                <label className="label">Year *</label>
                <input
                  type="number"
                  value={editMovie.year}
                  onChange={(e) => setEditMovie({...editMovie, year: e.target.value})}
                  className="input"
                  placeholder="Enter release year"
                />
              </div>
              <div className="form-group">
                <label className="label">Genre</label>
                <input
                  type="text"
                  value={editMovie.genre}
                  onChange={(e) => setEditMovie({...editMovie, genre: e.target.value})}
                  className="input"
                  placeholder="Enter genre"
                />
              </div>
              <div className="form-group">
                <label className="label">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editMovie.rating}
                  onChange={(e) => setEditMovie({...editMovie, rating: e.target.value})}
                  className="input"
                  placeholder="Enter rating (0-10)"
                />
              </div>
              <div className="form-group">
                <label className="label">Poster URL</label>
                <input
                  type="url"
                  value={editMovie.poster}
                  onChange={(e) => setEditMovie({...editMovie, poster: e.target.value})}
                  className="input"
                  placeholder="Enter poster image URL"
                />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea
                  value={editMovie.description}
                  onChange={(e) => setEditMovie({...editMovie, description: e.target.value})}
                  className="input textarea"
                  placeholder="Enter movie description"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={updateMovie}
                className="save-button"
                disabled={!editMovie.title || !editMovie.year}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieListApp;