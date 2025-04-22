import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useCharacters() {
  const [characters, setCharacters] = useState([]);

  const fetchCharacters = async () => {
    try {
      const res = await apiFetch('/api/characters');
      const data = await res.json();
      if (res.ok) setCharacters(data);
      else console.error(data.message);
    } catch (err) {
      console.error('❌ Failed to fetch characters:', err);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return { characters, setCharacters, fetchCharacters };
}
