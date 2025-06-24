import React from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const DragCard = ({ card, movies, onEdit, onDelete, onMouseDown, isDragging }) => {
  return (
    <div
      className={`drag-card-item${isDragging ? ' drag-card-item-dragging' : ''}`}
      data-card-id={card.id}
    >
      <div className="drag-card-left">
        <div 
          onMouseDown={onMouseDown} 
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
            if (movie) onEdit(movie);
          }}
          className="drag-card-edit-button"
          title="Edit movie"
        >
          <EditIcon boxSize="14px" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="drag-card-delete-button"
          title="Delete movie"
        >
          <DeleteIcon boxSize="14px" />
        </button>
      </div>
    </div>
  );
};

export default DragCard;
