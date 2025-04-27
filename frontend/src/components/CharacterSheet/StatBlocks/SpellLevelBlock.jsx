/**
 * Author: Brandon Trundle
 * File Name: SpellLevelBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders input fields for managing a single spell level's spells and available slots
 * within the spellcasting section of the character sheet.
 */

import React from 'react'; // React library for functional component and input rendering


/**
 * SpellLevelBlock Component
 * 
 * Purpose:
 * Provides inputs for entering spells and managing slot counts for a specific spell level.
 * 
 * Props:
 * @param {number} level - The spell level (0–9) being rendered.
 * @param {Object} values - Object containing the current spell data and slot counts.
 * @param {Function} onChange - Callback function to update the parent form state when spell data changes.
 * 
 * Behavior:
 * - Displays a labeled section for the spell level or cantrips.
 * - If the spell level is greater than 0, renders an input for available spell slots.
 * - Always renders a textarea for listing spells at that level.
 */
const SpellLevelBlock = ({ level, values, onChange }) => {
  const label = level === 0 ? 'Cantrips' : `Level ${level}`;
  const slotsName = `spellSlots_${level}`;
  const spellsName = `spells_${level}`;

  return (
    <div className="spell-level-block">
      <div className="spell-level-header">
        <span className="spell-level-label">{label}</span>
        {level > 0 && (
          <input
            type="number"
            name={slotsName}
            className="spell-slot-input"
            placeholder="Slots"
            min="0"
            value={values[slotsName] || ''}
            onChange={onChange}
          />
        )}
      </div>
      <textarea
        name={spellsName}
        className="spell-textarea"
        placeholder={`Enter ${label.toLowerCase()} here...`}
        value={values[spellsName] || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default SpellLevelBlock;
