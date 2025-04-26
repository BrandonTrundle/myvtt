import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useCharacters() {
  const [characters, setCharacters] = useState([]);

  const fetchCharacters = async () => {
    try {
      const data = await apiFetch('/characters');
      setCharacters(data);
    } catch (err) {
      console.error('❌ Failed to fetch characters:', err);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return { characters, setCharacters, fetchCharacters };
}
