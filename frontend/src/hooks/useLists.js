import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/lists` : 'http://localhost:5000/api/lists';

export const useLists = () => {
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch lists from database on component mount
  useEffect(() => {
    fetchLists();
  }, []);

  // Set current list to default when lists are loaded
  useEffect(() => {
    if (lists.length > 0 && !currentList) {
      const defaultList = lists.find(list => list.isDefault) || lists[0];
      setCurrentList(defaultList);
    }
  }, [lists, currentList]);

  const fetchLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      
      if (data.success) {
        setLists(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch lists');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching lists:', err);
      // Create default list if none exist
      if (err.message.includes('fetch')) {
        await createList('My Movies', 'Default movie list');
      }
    } finally {
      setLoading(false);
    }
  };

  const createList = async (name, description = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLists(prevLists => [...prevLists, data.data]);
        toast.success(`List "${name}" created successfully!`);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create list');
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error creating list: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateList = async (id, name, description = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLists(prevLists => 
          prevLists.map(list => list._id === id ? data.data : list)
        );
        
        // Update current list if it's the one being updated
        if (currentList && currentList._id === id) {
          setCurrentList(data.data);
        }
        
        toast.success(`List renamed to "${name}"!`);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update list');
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error updating list: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setLists(prevLists => prevLists.filter(list => list._id !== id));
        
        // If deleting current list, switch to first available list
        if (currentList && currentList._id === id) {
          const remainingLists = lists.filter(list => list._id !== id);
          setCurrentList(remainingLists[0] || null);
        }
        
        toast.success('List deleted successfully!');
      } else {
        throw new Error(data.message || 'Failed to delete list');
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error deleting list: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchToList = (list) => {
    setCurrentList(list);
    toast.success(`Switched to "${list.name}"`);
  };

  const setDefaultList = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/default`, {
        method: 'PATCH',
      });

      const data = await response.json();
      
      if (data.success) {
        setLists(prevLists => 
          prevLists.map(list => ({
            ...list,
            isDefault: list._id === id
          }))
        );
        
        toast.success('Default list updated!');
      } else {
        throw new Error(data.message || 'Failed to set default list');
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error setting default list: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lists,
    currentList,
    loading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
    switchToList,
    setDefaultList
  };
};
