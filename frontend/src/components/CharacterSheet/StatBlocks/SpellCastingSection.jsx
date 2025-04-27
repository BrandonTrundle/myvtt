/**
 * Author: Brandon Trundle
 * File Name: SpellcastingSection.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders the full spellcasting section of the character sheet, 
 * including spell slots and known spells for levels 0 through 9.
 */

import SpellLevelBlock from './SpellLevelBlock'; // Component for managing spells at a specific spell level

/**
 * SpellcastingSection Component
 * 
 * Purpose:
 * Dynamically generates and renders spell blocks for cantrips and each spell level (1–9).
 * 
 * Props:
 * @param {Object} values - Object containing the character's current spellcasting data.
 * @param {Function} onChange - Callback function to update spell data in the parent form.
 * 
 * Behavior:
 * - Creates 10 SpellLevelBlock components, one for each spell level.
 * - Passes down necessary data and handlers to each block for editing spells and slots.
 */
const SpellcastingSection = ({ values, onChange }) => {
  return (
    <div className="spellcasting-section">
      {Array.from({ length: 10 }).map((_, level) => (
        <SpellLevelBlock
          key={level}
          level={level}
          values={values}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default SpellcastingSection;
