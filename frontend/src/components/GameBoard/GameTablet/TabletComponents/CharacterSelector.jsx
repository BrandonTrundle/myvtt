import React from 'react';
import { useCharacters } from '../../../CharacterSheet/hooks/useCharacters';


const CharacterSelector = () => {
  const { characters, loading, error } = useCharacters();

  if (loading) return <div>Loading characters...</div>;
  if (error) return <div className="text-red-500">Error loading characters.</div>;

  const handleDragStart = (e, character) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: character._id,
      name: character.charname,
      portrait: character.portraitImage,
    }));
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">🧙 Characters</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {characters && characters.length > 0 ? (
          characters.map((char) => (
            <div
              key={char._id}
              draggable
              onDragStart={(e) => handleDragStart(e, char)}
              className="character-token"
              title={char.charname}
            >
              {char.portraitImage ? (
                <img
                  src={char.portraitImage}
                  alt={char.charname}
                />
              ) : (
                <div>❔</div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No characters found. Create one first!</p>
        )}
      </div>
    </div>
  );
};

export default CharacterSelector;
