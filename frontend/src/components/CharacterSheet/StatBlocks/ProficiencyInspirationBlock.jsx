/**
 * Author: Brandon Trundle
 * File Name: ProficiencyInspirationBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides input fields for a character's Inspiration points and Proficiency Bonus,
 * key mechanics in Dungeons & Dragons gameplay.
 */

import React from 'react'; // React library for form input handling and UI composition

/**
 * ProficiencyInspirationBlock Component
 * 
 * Purpose:
 * Renders editable fields for tracking a character's Inspiration and Proficiency Bonus.
 * 
 * Props:
 * @param {Object} values - Object containing the current values for inspiration and proficiency bonus.
 * @param {Function} onChange - Callback function to update the parent form state when these fields are modified.
 * 
 * Behavior:
 * - Displays two labeled inputs stacked vertically.
 * - Updates the parent form's state immediately on user input.
 */
const ProficiencyInspirationBlock = ({ values, onChange }) => {
  return (
    <div className="proficiency-inspiration-box">
      <div className="core-box">
        <label htmlFor="inspiration" className="core-label">Inspiration</label>
        <input
          name="inspiration"
          placeholder=""
          className="core-input"
          value={values.inspiration || ''}
          onChange={onChange}
        />
      </div>

      <div className="core-box" style={{ marginTop: '12px' }}>
        <label htmlFor="proficiencybonus" className="core-label">Proficiency Bonus</label>
        <input
          name="proficiencybonus"
          placeholder=""
          className="core-input"
          value={values.proficiencybonus || ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ProficiencyInspirationBlock;
