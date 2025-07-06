import React from 'react';
import { Search, Plus, Film, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ListSelector from './ListSelector';

const Header = ({ 
  searchTerm, 
  onSearchChange, 
  onAddMovie,
  onSearchMovies,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderToggle,
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
        <div className="sort-container">
          <button 
            className="sort-icon-button"
            onClick={onSortOrderToggle}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
          </button>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="rank">Rank</option>
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="genre">Genre</option>
            <option value="rating">Rating</option>
          </select>
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
