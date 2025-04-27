/**
 * Author: Brandon Trundle
 * File Name: WisdomAndProficiencies.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides input fields for a character's Passive Wisdom (Perception)
 * and a list of additional proficiencies and languages.
 */

import React from 'react'; // React library for building interactive form components

/**
 * WisdomAndProficiencies Component
 * 
 * Purpose:
 * Renders fields for setting Passive Wisdom and listing other proficiencies or languages known by the character.
 * 
 * Props:
 * @param {Object} values - Object containing the character's passive wisdom score and proficiencies.
 * @param {Function} onChange - Callback function to update the parent form state when inputs change.
 * 
 * Behavior:
 * - Provides a single-line input for Passive Wisdom score.
 * - Provides a textarea for tool proficiencies, language proficiencies, or similar notes.
 * - Updates the parent form when either input is modified.
 */
const WisdomAndProficiencies = ({ values, onChange }) => {
  return (
    <div className="wisdom-proficiencies-section">
      <div className="wisdom-box">
        <label htmlFor="passiveWisdom" className="wisdom-label">Passive Wisdom</label>
        <input
          type="text"
          name="passiveWisdom"
          className="wisdom-input"
          placeholder="e.g. 13"
          value={values.passiveWisdom || ''}
          onChange={onChange}
        />
      </div>

      <div className="proficiencies-box">
        <label htmlFor="otherProficiencies" className="proficiencies-label">
          Other Proficiencies & Languages
        </label>
        <textarea
          name="otherProficiencies"
          className="proficiencies-textarea"
          rows="5"
          placeholder="List any tool proficiencies, languages, etc."
          value={values.otherProficiencies || ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default WisdomAndProficiencies;
