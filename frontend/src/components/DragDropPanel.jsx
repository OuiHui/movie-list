import React from 'react';
import DragCard from './DragCard';

const DragDropPanel = ({ 
  dragCards, 
  movies, 
  containerRef, 
  draggedCard, 
  draggedOverIndex,
  onEdit, 
  onDelete, 
  onMouseDown 
}) => {
  return (
    <div className="right-panel">
      <h2 className="panel-title">Movie Rankings</h2>
      
      <div ref={containerRef} className="drag-card-container">
        {dragCards.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-message">No movies to rank yet</p>
            <p className="empty-state-hint">Add some movies to start ranking!</p>
          </div>
        ) : (
          <>
            {dragCards.map((card, index) => (
              <React.Fragment key={card.id}>
                {draggedOverIndex === index && draggedCard && (
                  <div className="drag-over-indicator" />
                )}
                
                <DragCard
                  card={card}
                  movies={movies}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMouseDown={(e) => onMouseDown(e, card)}
                  isDragging={draggedCard && draggedCard.id === card.id}
                />
              </React.Fragment>
            ))}
            
            {draggedOverIndex === dragCards.length && draggedCard && (
              <div className="drag-over-indicator" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DragDropPanel;
