import React, { useState } from 'react';
import Header from './components/Header';
import MovieGrid from './components/MovieGrid';
import DragDropPanel from './components/DragDropPanel';
import MovieModal from './components/MovieModal';
import MovieDetailModal from './components/MovieDetailModal';
import FloatingCard from './components/FloatingCard';
import { useMovies } from './hooks/useMovies';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import './App.css';

const MovieListApp = () => {
  const {
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
    refetchMovies
  } = useMovies();

  const {
    draggedCard,
    draggedOverIndex,
    mousePosition,
    isDragging,
    containerRef,
    handleMouseDown
  } = useDragAndDrop(dragCards, handleDragCardReorder);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  
  // Form states
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

  // Event handlers
  const handleAddMovie = () => {
    setIsModalOpen(true);
  };

  const handleSaveNewMovie = async () => {
    if (newMovie.title && newMovie.poster) {
      try {
        await addMovie(newMovie);
        setNewMovie({ title: '', year: '', genre: '', rating: '', poster: '', description: '' });
        setIsModalOpen(false);
      } catch (error) {
        alert(`Error adding movie: ${error.message}`);
      }
    } else {
      alert('Please provide title and poster URL');
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsDetailModalOpen(true);
  };

  const handleEditMovie = (movie) => {
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

  const handleSaveEditMovie = async () => {
    if (editMovie.title && editMovie.poster) {
      try {
        await updateMovie(editingMovie.id, editMovie);
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
      } catch (error) {
        alert(`Error updating movie: ${error.message}`);
      }
    } else {
      alert('Please provide title and poster URL');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await removeMovie(id);
      } catch (error) {
        alert(`Error deleting movie: ${error.message}`);
      }
    }
  };

  return (
    <div className="container">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddMovie={handleAddMovie}
      />

      <div className="main-content">
        <MovieGrid
          movies={filteredMovies}
          onEdit={handleEditMovie}
          onDelete={handleDeleteMovie}
          onMovieClick={handleMovieClick}
        />

        <DragDropPanel
          dragCards={dragCards}
          movies={movies}
          containerRef={containerRef}
          draggedCard={draggedCard}
          draggedOverIndex={draggedOverIndex}
          onEdit={handleEditMovie}
          onDelete={handleDeleteMovie}
          onMouseDown={handleMouseDown}
        />
      </div>

      <FloatingCard
        isVisible={isDragging}
        card={draggedCard}
        mousePosition={mousePosition}
      />

      <MovieModal
        isOpen={isModalOpen}
        movie={newMovie}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewMovie}
        onChange={setNewMovie}
        title="Add New Movie"
        isEdit={false}
      />

      <MovieDetailModal
        isOpen={isDetailModalOpen}
        movie={selectedMovie}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <MovieModal
        isOpen={isEditModalOpen}
        movie={editMovie}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditMovie}
        onChange={setEditMovie}
        title="Edit Movie"
        isEdit={true}
      />
    </div>
  );
};

export default MovieListApp;