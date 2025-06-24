import React from 'react';

const FloatingCard = ({ isVisible, card, mousePosition }) => {
  if (!isVisible || !card) return null;

  return (
    <div 
      className="floating-card" 
      style={{
        left: mousePosition.x - 150,
        top: mousePosition.y - 30
      }}
    >
      <h3 className="floating-card-title">{card.title}</h3>
      <p className="floating-card-text">{card.content}</p>
    </div>
  );
};

export default FloatingCard;
