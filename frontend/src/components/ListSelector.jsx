import React, { useState } from 'react';
import { ChevronDown, Plus, Edit2, Trash2, Star } from 'lucide-react';

const ListSelector = ({ 
  lists, 
  currentList, 
  onSelectList, 
  onCreateList, 
  onRenameList, 
  onDeleteList,
  onSetDefault,
  isToggleBar = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRenameForm, setShowRenameForm] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [renameValue, setRenameValue] = useState('');

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
      setShowCreateForm(false);
      setIsDropdownOpen(false);
    }
  };

  const handleRenameList = (e, listId) => {
    e.preventDefault();
    if (renameValue.trim()) {
      onRenameList(listId, renameValue.trim());
      setShowRenameForm(null);
      setRenameValue('');
    }
  };

  const handleDeleteList = (listId, listName) => {
    if (lists.length <= 1) {
      toast.error("Cannot delete the last remaining list");
      return;
    }
    
    // Use toast for confirmation instead of browser alert
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <strong>Delete "{listName}"?</strong>
          <br />
          <span style={{ fontSize: '0.9em', color: '#ccc' }}>
            This will permanently delete the list and all its movies.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onDeleteList(listId);
              toast.success(`List "${listName}" deleted`);
            }}
            style={{
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: '#333',
              color: '#ccc',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      style: {
        maxWidth: '350px',
        padding: '16px',
      }
    });
  };

  // Toggle bar rendering for header integration
  if (isToggleBar) {
    return (
      <div className="list-toggle-bar">
        {lists.map(list => (
          <div key={list._id} className="toggle-bar-list-item">
            {showRenameForm === list._id ? (
              <form 
                onSubmit={(e) => handleRenameList(e, list._id)} 
                className="toggle-rename-form"
              >
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="toggle-rename-input"
                  autoFocus
                  onBlur={() => {
                    setShowRenameForm(null);
                    setRenameValue('');
                  }}
                />
              </form>
            ) : (
              <>
                <button
                  className={`toggle-bar-item ${currentList?._id === list._id ? 'active' : ''}`}
                  onClick={() => onSelectList(list)}
                  title={list.name}
                >
                  {list.name}
                  {list.isDefault && <Star size={12} className="toggle-default-star" fill="#ffd700" color="#ffd700" />}
                </button>
                
                {/* Hover menu */}
                <div className="toggle-hover-menu">
                  <button
                    className="toggle-option-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameValue(list.name);
                      setShowRenameForm(list._id);
                    }}
                  >
                    <Edit2 size={14} />
                    Rename
                  </button>
                  {!list.isDefault && (
                    <button
                      className="toggle-option-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetDefault(list._id);
                      }}
                    >
                      <Star size={14} />
                      Set Default
                    </button>
                  )}
                  {lists.length > 1 && (
                    <button
                      className="toggle-option-item delete-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list._id, list.name);
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        <button
          className="toggle-bar-item add-list-btn"
          onClick={() => setShowCreateForm(true)}
          title="Create new list"
        >
          <Plus size={14} />
        </button>
        
        {/* Create form modal overlay */}
        {showCreateForm && (
          <>
            <div className="toggle-overlay" onClick={() => setShowCreateForm(false)} />
            <div className="toggle-create-form">
              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name"
                  className="list-input"
                  autoFocus
                />
                <div className="form-buttons">
                  <button type="submit" className="save-btn">Save</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewListName('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    );
  }

  // Original dropdown rendering
  return (
    <div className="list-selector">
      <div className="list-selector-current" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <span className="list-name">{currentList?.name || 'Select List'}</span>
        <ChevronDown 
          size={20} 
          className={`chevron ${isDropdownOpen ? 'open' : ''}`}
        />
      </div>

      {isDropdownOpen && (
        <div className="list-dropdown">
          <div className="list-dropdown-header">
            <span>Switch to List</span>
            <button
              className="create-list-btn"
              onClick={() => setShowCreateForm(true)}
              title="Create new list"
            >
              <Plus size={16} />
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateList} className="create-list-form">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name"
                className="list-input"
                autoFocus
              />
              <div className="form-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewListName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="list-options">
            {lists.map(list => (
              <div key={list._id} className="list-option">
                {showRenameForm === list._id ? (
                  <form onSubmit={(e) => handleRenameList(e, list._id)} className="rename-form">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="list-input"
                      autoFocus
                    />
                    <div className="form-buttons">
                      <button type="submit" className="save-btn">Save</button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                          setShowRenameForm(null);
                          setRenameValue('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div 
                      className={`list-option-main ${currentList?._id === list._id ? 'active' : ''}`}
                      onClick={() => {
                        onSelectList(list);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="list-option-name">
                        {list.name}
                        {list.isDefault && (
                          <Star size={14} className="default-star" fill="#ffd700" color="#ffd700" />
                        )}
                      </span>
                    </div>
                    <div className="list-option-actions">
                      <button
                        className="list-action-btn"
                        onClick={() => {
                          setRenameValue(list.name);
                          setShowRenameForm(list._id);
                        }}
                        title="Rename list"
                      >
                        <Edit2 size={14} strokeWidth={0.5} />
                      </button>
                      {!list.isDefault && (
                        <button
                          className="list-action-btn set-default-btn"
                          onClick={() => onSetDefault(list._id)}
                          title="Set as default"
                        >
                          <Star size={14} strokeWidth={0.5} />
                        </button>
                      )}
                      {lists.length > 1 && (
                        <button
                          className="list-action-btn delete-btn"
                          onClick={() => handleDeleteList(list._id, list.name)}
                          title="Delete list"
                        >
                          <Trash2 size={14} strokeWidth={0.5} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSelector;
