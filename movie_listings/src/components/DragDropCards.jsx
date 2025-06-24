import React, { useState, useRef } from 'react';
import './DragDropCards.css'; // Import the CSS file

const DragDropCards = () => {
  const initialCards = [
    { id: 1, title: 'Task 1', content: 'Complete project documentation' },
    { id: 2, title: 'Task 2', content: 'Review code changes' },
    { id: 3, title: 'Task 3', content: 'Update user interface' },
    { id: 4, title: 'Task 4', content: 'Test new features' },
    { id: 5, title: 'Task 5', content: 'Deploy to production' }
  ];

  const [cards, setCards] = useState(initialCards);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const containerRef = useRef(null);
  const draggedCardRef = useRef(null);
  const draggedOverIndexRef = useRef(null);

  const handleMouseDown = (e, card) => {
    e.preventDefault();
    setDraggedCard(card);
    draggedCardRef.current = card;   // track in ref
    setIsDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Find which card we're hovering over
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const cardElement = elements.find(el => el.classList.contains('card-item') && !el.classList.contains('dragging'));
      
      if (cardElement) {
        const cardId = parseInt(cardElement.dataset.cardId);
        const cardIndex = cards.findIndex(c => c.id === cardId);
        
        if (cardIndex !== -1 && cardId !== card.id) {
          const rect = cardElement.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          const dropIndex = e.clientY < midpoint ? cardIndex : cardIndex + 1;
          setDraggedOverIndex(dropIndex);
          draggedOverIndexRef.current = dropIndex;  // track in ref
        }
      } else {
        // Check if we're at the very end of the list
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          if (e.clientY > containerRect.bottom - 50) {
            setDraggedOverIndex(cards.length);
          }
        }
      }
    };

    const handleMouseUp = () => {
      const overIndex = draggedOverIndexRef.current;
      const cardRef = draggedCardRef.current;
      if (overIndex !== null && cardRef) {
        setCards(prevCards => {
          const currentIndex = prevCards.findIndex(c => c.id === cardRef.id);
          if (currentIndex === -1 || overIndex === currentIndex) return prevCards;
          const updated = Array.from(prevCards);
          const [moved] = updated.splice(currentIndex, 1);
          const adjustedIndex = overIndex > currentIndex ? overIndex - 1 : overIndex;
          updated.splice(adjustedIndex, 0, moved);
          return updated;
        });
      }
      draggedCardRef.current = null;
      draggedOverIndexRef.current = null;
      setDraggedCard(null);
      setDraggedOverIndex(null);
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleEditClick = (card) => {
    setEditingCardId(card.id);
    setEditTitle(card.title);
    setEditContent(card.content);
  };

  const handleSave = (id) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, title: editTitle, content: editContent } : c));
    setEditingCardId(null);
  };

  const handleCancel = () => {
    setEditingCardId(null);
  };

  // Delete and Add handlers
  const handleDelete = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCard = () => {
    const title = window.prompt('Enter card title:', '');
    if (title === null) return;
    const content = window.prompt('Enter card content:', '');
    if (content === null) return;
    const newId = Date.now();
    setCards(prev => [...prev, { id: newId, title, content }]);
  };

  // Trash delete icon
  const DeleteIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6h18v2H3V6zm2 3h14v12H5V9zm3 3v6h2v-6H8zm4 0v6h2v-6h-2z" />
    </svg>
  );

  const DragIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="4" r="1" fill="#666"/>
      <circle cx="12" cy="4" r="1" fill="#666"/>
      <circle cx="4" cy="8" r="1" fill="#666"/>
      <circle cx="12" cy="8" r="1" fill="#666"/>
      <circle cx="4" cy="12" r="1" fill="#666"/>
      <circle cx="12" cy="12" r="1" fill="#666"/>
    </svg>
  );

  // Pencil edit icon
  const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );

  return (
    <div className="app-container">
      <h2 className="app-title">Drag and Drop Cards</h2>
      <button className="add-button" onClick={handleAddCard}>Add Card</button>

      <div ref={containerRef} className="card-container">
        {cards.map((card, index) => (
          <React.Fragment key={card.id}>
            {/* Drop line indicator */}
            {draggedOverIndex === index && draggedCard && <div className="drag-over-indicator" />}
            
            <div
              className={`card-item${draggedCard && draggedCard.id === card.id ? ' dragging' : ''}`}
              data-card-id={card.id}
            >
              <div className="card-left">
                <div onMouseDown={(e) => handleMouseDown(e, card)} className="drag-icon-wrapper">
                  <DragIcon />
                </div>
                {editingCardId === card.id ? (
                  <div className="card-content">
                    <input className="edit-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <input className="edit-input" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <button className="save-button" onClick={() => handleSave(card.id)}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <div className="card-content">
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-text">{card.content}</p>
                  </div>
                )}
              </div>
              {editingCardId !== card.id && (
                <> 
                  <div className="edit-icon-wrapper" onClick={() => handleEditClick(card)}>
                    <EditIcon />
                  </div>
                  <div className="delete-icon-wrapper" onClick={() => handleDelete(card.id)}>
                    <DeleteIcon />
                  </div>
                </>
              )}
             </div>
           </React.Fragment>
         ))}
         
         {/* Drop line at the end */}
         {draggedOverIndex === cards.length && draggedCard && <div className="drag-over-indicator" />}
       </div>
       
       {/* Floating dragged card */}
       {isDragging && draggedCard && (
         <div className="floating-card" style={{ left: mousePosition.x - 150, top: mousePosition.y - 30 }}>
           <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>
             {draggedCard.title}
           </h3>
           <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
             {draggedCard.content}
           </p>
         </div>
       )}
    </div>
   );
};

export default DragDropCards;