// CharacterDashboard.jsx

import React, { useState } from 'react';
import { useCharacters } from '../hooks/useCharacters';
import CharacterSheetWindow from '../components/CharacterSheet/CharacterSheetWindow';
import { apiFetch } from '../utils/api';

const CharacterDashboard = () => {
  const { characters, setCharacters, fetchCharacters } = useCharacters();
  const [showSheet, setShowSheet] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);

  const handleCreateClick = () => {
    const useWizard = window.confirm('Would you like to use the character creation wizard?');
    if (useWizard) {
      alert('Wizard not implemented yet. Please use manual mode.');
    } else {
      setActiveCharacter(null);
      setShowSheet(true);
    }
  };

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

  const handleCharacterClick = (char) => {
    setActiveCharacter(char);
    setShowSheet(true);
  };

  const handleCharacterSaved = async () => {
    const exit = window.confirm('Character saved! Exit character creation?');
    if (exit) {
      setShowSheet(false);
      await fetchCharacters();
    }
  };

  return (
    <div className="bg-parchment min-h-screen px-6 py-10 text-arcanadeep">
      <h1 className="text-4xl font-bold mb-6">Your Characters</h1>

      {/* Create Character Button */}
      <button
        onClick={handleCreateClick}
        className="mb-6 bg-arcanared text-white px-4 py-2 rounded hover:bg-arcanabrown"
      >
        ➕ Create Character
      </button>

      {showSheet && (
        <CharacterSheetWindow
          onClose={() => setShowSheet(false)}
          onSaveSuccess={handleCharacterSaved}
          character={activeCharacter}
        />
      )}

      {/* Character list */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Saved Characters</h2>
        {characters.length === 0 ? (
          <p className="text-gray-600">No characters yet.</p>
        ) : (
          <div className="grid gap-4">
            {characters.map((char) => (
              <div
                key={char._id}
                className="bg-white p-4 rounded shadow border border-arcanabrown cursor-pointer hover:bg-gray-100"
                onClick={() => handleCharacterClick(char)}
              >
                <h3 className="text-lg font-bold">{char.name}</h3>
                <p>Class: {char.class}</p>
                <p>Race: {char.race}</p>
                <p>Level: {char.level}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(char._id);
                  }}
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