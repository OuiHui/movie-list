import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import MovieGrid from './components/MovieGrid';
import DragDropPanel from './components/DragDropPanel';
import MovieModal from './components/MovieModal';
import MovieDetailModal from './components/MovieDetailModal';
import FloatingCard from './components/FloatingCard';
import { useMovies } from './hooks/useMovies';
import { useLists } from './hooks/useLists';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import './App.css';

const MovieListApp = () => {
  // List management
  const {
    lists,
    currentList,
    loading: listsLoading,
    createList,
    updateList,
    deleteList,
    switchToList,
    setDefaultList
  } = useLists();

  // Movie management for current list
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
  } = useMovies(currentList?._id);

  const {
    draggedCard,
    draggedOverIndex,
    mousePosition,
    isDragging,
    containerRef,
    handleMouseDown
  } = useDragAndDrop(dragCards, (reorderedCards) => 
    handleDragCardReorder(reorderedCards, currentList?._id)
  );

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
    description: '',
    personalNote: ''
  });
  const [editMovie, setEditMovie] = useState({
    id: null,
    title: '',
    year: '',
    genre: '',
    rating: '',
    poster: '',
    description: '',
    personalNote: ''
  });

  // Event handlers
  const handleAddMovie = () => {
    setIsModalOpen(true);
  };

  const handleSaveNewMovie = async () => {
    if (newMovie.title && newMovie.poster) {
      try {
        await addMovie(newMovie, currentList?._id);
        setNewMovie({ title: '', year: '', genre: '', rating: '', poster: '', description: '', personalNote: '' });
        setIsModalOpen(false);
        toast.success('Movie added successfully!');
      } catch (error) {
        toast.error(`Error adding movie: ${error.message}`);
      }
    } else {
      toast.error('Please provide title and poster URL');
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
      description: movie.description,
      personalNote: movie.personalNote || ''
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
          description: '',
          personalNote: ''
        });
        toast.success('Movie updated successfully!');
      } catch (error) {
        toast.error(`Error updating movie: ${error.message}`);
      }
    } else {
      toast.error('Please provide title and poster URL');
    }
  };

  const handleDeleteMovie = async (id) => {
    toast((t) => (
      <div className="toast-confirm">
        <div className="toast-message">
          <strong>Delete Movie</strong>
          <p>Are you sure you want to delete this movie?</p>
        </div>
        <div className="toast-buttons">
          <button
            className="toast-button toast-button-cancel"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="toast-button toast-button-confirm"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await removeMovie(id);
                toast.success('Movie deleted successfully!');
              } catch (error) {
                toast.error(`Error deleting movie: ${error.message}`);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '0',
      }
    });
  };

  return (
    <div className="container">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddMovie={handleAddMovie}
        lists={lists}
        currentList={currentList}
        onSelectList={switchToList}
        onCreateList={createList}
        onRenameList={updateList}
        onDeleteList={deleteList}
        onSetDefault={setDefaultList}
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
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#4ecdc4',
              secondary: '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#1a1a1a',
            },
          },
        }}
      />
    </div>
  );
};

export default MovieListApp;