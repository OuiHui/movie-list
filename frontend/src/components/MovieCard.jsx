import React from 'react';
import { Star } from 'lucide-react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const MovieCard = ({ movie, index, onEdit, onDelete, onClick }) => {
  // Use originalRank if available, otherwise fall back to index + 1
  const displayRank = movie.originalRank || (index + 1);
  
  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="movie-rank">#{displayRank}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(movie.id);
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
          onEdit(movie);
        }}
        className="edit-button"
        title="Edit movie"
      >
        <EditIcon boxSize="14px" />
      </button>
    </div>
  );
};

export default MovieCard;
