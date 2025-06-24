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
      </div>
    </div>
  );
};

export default DragDropPanel;
