// CharacterDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useCharacters } from '../hooks/useCharacters';
import CharacterSheetWindow from '../components/CharacterSheet/CharacterSheetWindow';
import { apiFetch } from '../utils/api';

const CharacterDashboard = () => {
  const { characters, setCharacters, fetchCharacters } = useCharacters();
  const [showSheet, setShowSheet] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'CHARACTER_SAVED') {
        console.log('📩 Character saved message received. Refreshing list...');
        fetchCharacters();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [fetchCharacters]);

  const hydrateCharacterData = (char) => {
    const defaultSkills = [
      { name: 'Acrobatics', stat: 'Dex', mod: '', proficient: false },
      { name: 'Animal Handling', stat: 'Wis', mod: '', proficient: false },
      { name: 'Arcana', stat: 'Int', mod: '', proficient: false },
      { name: 'Athletics', stat: 'Str', mod: '', proficient: false },
      { name: 'Deception', stat: 'Cha', mod: '', proficient: false },
      { name: 'History', stat: 'Int', mod: '', proficient: false },
      { name: 'Insight', stat: 'Wis', mod: '', proficient: false },
      { name: 'Intimidation', stat: 'Cha', mod: '', proficient: false },
      { name: 'Investigation', stat: 'Int', mod: '', proficient: false },
      { name: 'Medicine', stat: 'Wis', mod: '', proficient: false },
      { name: 'Nature', stat: 'Int', mod: '', proficient: false },
      { name: 'Perception', stat: 'Wis', mod: '', proficient: false },
      { name: 'Performance', stat: 'Cha', mod: '', proficient: false },
      { name: 'Persuasion', stat: 'Cha', mod: '', proficient: false },
      { name: 'Religion', stat: 'Int', mod: '', proficient: false },
      { name: 'Sleight of Hand', stat: 'Dex', mod: '', proficient: false },
      { name: 'Stealth', stat: 'Dex', mod: '', proficient: false },
      { name: 'Survival', stat: 'Wis', mod: '', proficient: false },
    ];

    const defaultAttacks = [
      { name: '', atk: '', damage: '', type: '' },
      { name: '', atk: '', damage: '', type: '' },
      { name: '', atk: '', damage: '', type: '' },
    ];

    return {
      ...char,
      skills: Array.isArray(char.skills) && char.skills.length > 0 ? char.skills : defaultSkills,
      attacks: Array.isArray(char.attacks) && char.attacks.length > 0 ? char.attacks : defaultAttacks,
    };
  };

  const handleCreateClick = () => {
    const useWizard = window.confirm('Would you like to use the character creation wizard?');
    if (useWizard) {
      alert('Wizard not implemented yet. Please use manual mode.');
    } else {
      setActiveCharacter(null);
      setShowSheet(true);
      console.log("🖱️ Opening character creation sheet (manual mode).");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this character?')) return;

    console.log(`🗑️ Deleting character with ID: ${id}`);
    try {
      await apiFetch(`/characters/${id}`, { method: 'DELETE' });
      await fetchCharacters();
      console.log("✅ Character deleted and list refreshed");
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert(err.message || 'Failed to delete character');
    }
  };

  const handleCharacterClick = async (char) => {
    try {
      const fullChar = await apiFetch(`/characters/${char._id}`);
      const hydratedChar = hydrateCharacterData(fullChar);
      console.log("✅ Character loaded and hydrated:", hydratedChar);
      setActiveCharacter(hydratedChar);
      setShowSheet(true);
    } catch (err) {
      console.error('❌ Failed to load character:', err);
      alert('There was a problem loading this character.');
    }
  };

  const handleCharacterSaved = async () => {
    setShowSheet(false);
    await fetchCharacters();
    console.log("✅ Character saved and list refreshed.");
  };

  return (
    <div className="bg-parchment min-h-screen px-6 py-10 text-arcanadeep">
      <h1 className="text-4xl font-bold mb-6">Your Characters</h1>

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
                <div className="flex gap-4 items-center">
                  <img
                    src={char.portraitImage || '/default images/DefaultCharacter.png'}
                    alt={`${char.charname}'s portrait`}
                    className="w-16 h-16 object-cover rounded-full border border-arcanabrown"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{char.charname}</h3>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDashboard;
