import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onEdit, onDelete, onMovieClick }) => {
  return (
    <div className="left-panel">
      <h2 className="panel-title">Movie Collection</h2>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
