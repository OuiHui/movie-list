import React from 'react';
import { X } from 'lucide-react';

const MovieModal = ({ isOpen, movie, onClose, onSave, onChange, title, isEdit = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="label">Title *</label>
            <input
              type="text"
              value={movie.title}
              onChange={(e) => onChange({...movie, title: e.target.value})}
              className="input"
              placeholder="Enter movie title"
            />
          </div>
          <div className="form-group">
            <label className="label">Year *</label>
            <input
              type="number"
              value={movie.year}
              onChange={(e) => onChange({...movie, year: e.target.value})}
              className="input"
              placeholder="Enter release year"
            />
          </div>
          <div className="form-group">
            <label className="label">Genre</label>
            <input
              type="text"
              value={movie.genre}
              onChange={(e) => onChange({...movie, genre: e.target.value})}
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
              value={movie.rating}
              onChange={(e) => onChange({...movie, rating: e.target.value})}
              className="input"
              placeholder="Enter rating (0-10)"
            />
          </div>
          <div className="form-group">
            <label className="label">Poster URL *</label>
            <input
              type="url"
              value={movie.poster}
              onChange={(e) => onChange({...movie, poster: e.target.value})}
              className="input"
              placeholder="Enter poster image URL"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              value={movie.description}
              onChange={(e) => onChange({...movie, description: e.target.value})}
              className="input textarea"
              placeholder="Enter movie description"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="save-button"
            disabled={!movie.title || !movie.year || !movie.poster}
          >
            {isEdit ? 'Save Changes' : 'Add Movie'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
