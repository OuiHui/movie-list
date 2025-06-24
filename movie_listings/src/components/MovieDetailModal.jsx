import React from 'react';
import { X, Star } from 'lucide-react';

const MovieDetailModal = ({ isOpen, movie, onClose }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{movie.title}</h2>
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>
        </div>
        <div className="detail-modal-body">
          <div className="detail-content">
            <img
              src={movie.poster}
              alt={movie.title}
              className="detail-poster"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(movie.title)}`;
              }}
            />
            <div className="detail-info">
              <div className="detail-metadata">
                <p className="detail-year"><strong>Year:</strong> {movie.year}</p>
                <p className="detail-genre"><strong>Genre:</strong> {movie.genre}</p>
                <div className="detail-rating">
                  <strong>Rating:</strong>
                  <div className="rating-container">
                    <Star size={20} fill="#ffd700" color="#ffd700" />
                    <span className="rating-text">{movie.rating}/10</span>
                  </div>
                </div>
              </div>
              <div className="description-section">
                <h3 className="description-title">Description</h3>
                <p className="description-text">{movie.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
