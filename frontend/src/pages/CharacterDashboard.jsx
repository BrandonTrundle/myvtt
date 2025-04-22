import React from 'react';
import CharacterForm from '../components/CharacterForm';
import { useCharacters } from '../hooks/useCharacters';
import { apiFetch } from '../utils/api';

const CharacterDashboard = () => {
  const { characters, setCharacters, fetchCharacters } = useCharacters();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this character?')) return;

    try {
      const res = await apiFetch(`/api/characters/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCharacters((prev) => prev.filter((char) => char._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete character');
      }
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  return (
    <div className="bg-parchment min-h-screen px-6 py-10 text-arcanadeep">
      <h1 className="text-4xl font-bold mb-6">Your Characters</h1>

      {/* Character form */}
      <CharacterForm onCreate={fetchCharacters} />

      {/* Character list */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Saved Characters</h2>
        {characters.length === 0 ? (
          <p className="text-gray-600">No characters yet.</p>
        ) : (
          <div className="grid gap-4">
            {characters.map((char) => (
              <div key={char._id} className="bg-white p-4 rounded shadow border border-arcanabrown">
                <h3 className="text-lg font-bold">{char.name}</h3>
                <p>Class: {char.class}</p>
                <p>Race: {char.race}</p>
                <p>Level: {char.level}</p>
                <button
                  onClick={() => handleDelete(char._id)}
                  className="mt-2 text-red-600 underline text-sm hover:text-arcanabrown"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* For DMs */}
      <div className="mt-16 border-t border-arcanabrown pt-6">
        <h2 className="text-2xl font-bold mb-4">🎲 Resources for DMs</h2>
        <ul className="list-disc ml-6 text-sm text-gray-800">
          <li>
            <a href="https://fastcharacter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Fast Character Generator
            </a>
          </li>
          <li>
            <a href="https://www.dndbeyond.com/monsters" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              D&D Monster Lookup
            </a>
          </li>
          <li>
            <a href="https://www.gmbinder.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              GM Binder (for homebrew rules and PDFs)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CharacterDashboard;
