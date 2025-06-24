import { useState, useRef } from 'react';

export const useDragAndDrop = (dragCards, onReorder) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef(null);
  const draggedCardRef = useRef(null);
  const draggedOverIndexRef = useRef(null);

  const handleMouseDown = (e, card) => {
    e.preventDefault();
    setDraggedCard(card);
    draggedCardRef.current = card;
    setIsDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const cardElement = elements.find(el => 
        el.classList.contains('drag-card-item') && 
        !el.classList.contains('dragging')
      );
      
      if (cardElement) {
        const cardId = parseInt(cardElement.dataset.cardId);
        const cardIndex = dragCards.findIndex(c => c.id === cardId);
        
        if (cardIndex !== -1 && cardId !== card.id) {
          const rect = cardElement.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          const dropIndex = e.clientY < midpoint ? cardIndex : cardIndex + 1;
          setDraggedOverIndex(dropIndex);
          draggedOverIndexRef.current = dropIndex;
        }
      } else {
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          if (e.clientY > containerRect.bottom - 50) {
            setDraggedOverIndex(dragCards.length);
          }
        }
      }
    };

    const handleMouseUp = () => {
      const overIndex = draggedOverIndexRef.current;
      const cardRef = draggedCardRef.current;
      
      if (overIndex !== null && cardRef) {
        const currentIndex = dragCards.findIndex(c => c.id === cardRef.id);
        if (currentIndex !== -1 && overIndex !== currentIndex) {
          const updated = Array.from(dragCards);
          const [moved] = updated.splice(currentIndex, 1);
          const adjustedIndex = overIndex > currentIndex ? overIndex - 1 : overIndex;
          updated.splice(adjustedIndex, 0, moved);
          onReorder(updated);
        }
      }
      
      // Reset state
      draggedCardRef.current = null;
      draggedOverIndexRef.current = null;
      setDraggedCard(null);
      setDraggedOverIndex(null);
      setIsDragging(false);
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    draggedCard,
    draggedOverIndex,
    mousePosition,
    isDragging,
    containerRef,
    handleMouseDown
  };
};
