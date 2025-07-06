import React from 'react';
import { Search, Plus, Film } from 'lucide-react';
import ListSelector from './ListSelector';

const Header = ({ 
  searchTerm, 
  onSearchChange, 
  onAddMovie,
  onSearchMovies,
  // List selector props
  lists,
  currentList,
  onSelectList,
  onCreateList,
  onRenameList,
  onDeleteList,
  onSetDefault
}) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="title">Ranking Maker by Huy Nguyen</h1>
        <h2 className="subtitle">{currentList?.name || 'Movie Collection'}</h2>
      </div>
      <div className="header-controls">
        <div className="header-list-selector">
          <ListSelector
            lists={lists}
            currentList={currentList}
            onSelectList={onSelectList}
            onCreateList={onCreateList}
            onRenameList={onRenameList}
            onDeleteList={onDeleteList}
            onSetDefault={onSetDefault}
            isToggleBar={true}
          />
        </div>
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search your movies..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="header-buttons">
          <button 
            className="search-movies-button"
            onClick={onSearchMovies}
            title="Search movies database"
          >
            <Film size={20} />
            Search Movies
          </button>
          <button 
            className="add-button"
            onClick={onAddMovie}
            title="Add movie manually"
          >
            <Plus size={20} />
            Add Movie
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
