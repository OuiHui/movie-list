import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onEdit, onDelete, onMovieClick }) => {
  return (
    <div className="left-panel">
      <h2 className="panel-title">Movie Collection</h2>
      <div className="movie-grid">
        {movies.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-message">There are currently no entries in this list</p>
            <p className="empty-state-hint">Click "Add Movie" to get started!</p>
          </div>
        ) : (
          movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              onClick={onMovieClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MovieGrid;
