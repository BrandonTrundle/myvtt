/**
 * Author: Brandon Trundle
 * File Name: useCharacters.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook for managing character data retrieval and storage.
 * 
 * Behavior:
 * - Fetches the user's characters from the server on mount.
 * - Exposes characters array, a setter function, and a manual refetch function.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect, useState } from 'react'; // React hooks for state and side effects
import { apiFetch } from '../utils/api'; // Utility for making authenticated API requests

/**
 * useCharacters Hook
 * 
 * Provides access to the user's characters and methods to manage them.
 * 
 * @returns {Object} - { characters, setCharacters, fetchCharacters }
 */
export function useCharacters() {
  const [characters, setCharacters] = useState([]);

/**
 * Fetches the list of user characters from the server.
 * 
 * Behavior:
 * - Sends an authenticated GET request to /characters.
 * - Updates local state with the retrieved character data.
 * 
 * @throws {Error} - If network request fails
 */
  const fetchCharacters = async () => {
    try {
      const data = await apiFetch('/characters');
      setCharacters(data);
    } catch (err) {
      console.error('❌ Failed to fetch characters:', err);
    }
  };
  
/**
 * Fetches characters once when the hook is initialized.
 */
  useEffect(() => {
    fetchCharacters();
  }, []);

  return { characters, setCharacters, fetchCharacters };
}
