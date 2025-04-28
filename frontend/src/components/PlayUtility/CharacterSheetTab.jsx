import React, { useState } from 'react';
// Import all your character sheet sections here
// Example:
// import AbilityScores from '../components/CharacterSheet/AbilityScores';
// import CombatStats from '../components/CharacterSheet/CombatStats';

const CharacterSheetTab = () => {
  const [activeSection, setActiveSection] = useState(null);

  const renderSection = () => {
    switch (activeSection) {
      case 'abilities':
        return <p>AbilityScores Component</p>; // Replace with <AbilityScores />
      case 'combat':
        return <p>CombatStats Component</p>; // Replace with <CombatStats />
      case 'equipment':
        return <p>EquipmentSection Component</p>;
      case 'spells':
        return <p>SpellCastingInfoBlock Component</p>;
      case 'personality':
        return <p>PersonalityTraits Component</p>;
      default:
        return (
          <div className="space-y-4">
            <p>View all sections here (stacked)</p>
            {/* Render all sections here if no activeSection selected */}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Character Sheet</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setActiveSection(null)}
        >
          View Full Sheet
        </button>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setActiveSection('abilities')}
        >
          Abilities
        </button>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setActiveSection('combat')}
        >
          Combat
        </button>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setActiveSection('equipment')}
        >
          Equipment
        </button>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setActiveSection('spells')}
        >
          Spells
        </button>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setActiveSection('personality')}
        >
          Personality
        </button>
      </div>

      <div className="border rounded p-4 bg-gray-50">
        {renderSection()}
      </div>
    </div>
  );
};

export default CharacterSheetTab;
