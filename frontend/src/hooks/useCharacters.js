import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useCharacters() {
  const [characters, setCharacters] = useState([]);

  const fetchCharacters = async () => {
    try {
      const res = await apiFetch('/characters');
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text); // ✅ Only try if it's real JSON
      } catch (err) {
        console.warn("⚠️ Could not parse JSON. Response was:", text);
        return; // Or handle fallback logic here
      }
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
