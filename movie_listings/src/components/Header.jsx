import React from 'react';
import { Search, Plus } from 'lucide-react';

const Header = ({ searchTerm, onSearchChange, onAddMovie }) => {
  return (
    <header className="header">
      <h1 className="title">Top 100 Movies</h1>
      <div className="header-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={onAddMovie} className="add-button">
          <Plus size={20} />
          Add Movie
        </button>
      </div>
    </header>
  );
};

export default Header;
