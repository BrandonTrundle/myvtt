/**
 * Author: Brandon Trundle
 * File Name: DeathSaves.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Manages and displays a character's hit dice, death save successes, and death save failures.
 * Allows users to check off successes and failures during combat encounters.
 */

import React from 'react'; // React library for building form-driven UI components

/**
 * DeathSaves Component
 * 
 * Purpose:
 * Renders input fields and checkboxes for tracking a character's hit dice and death saving throws.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current death save and hit dice values.
 * @param {Function} onChange - Callback function to update the parent form state based on user input.
 * 
 * Behavior:
 * - Displays a text input for recording current hit dice.
 * - Displays three checkboxes each for death save successes and failures.
 * - Handles checkbox state changes and updates the parent form.
 */
const DeathSaves = ({ values, onChange }) => {
/**
 * Handles updating success or failure checkboxes when clicked.
 * 
 * @param {string} type - Either 'success' or 'failure' indicating the save type.
 * @param {number} index - Index of the checkbox (0, 1, or 2).
 * @param {boolean} checked - Whether the checkbox is now checked or unchecked.
 */
  const handleCheck = (type, index, checked) => {
    const key = `${type}-${index}`;
    onChange({
      target: {
        name: key,
        value: checked
      }
    });
  };

  return (
    <div className="death-saves-container">
      <div className="hit-dice-box">
        <label htmlFor="hitdice" className="death-label">Hit Dice</label>
        <input
          name="hitdice"
          placeholder=""
          className="hit-dice-input"
          value={values.hitdice || ''}
          onChange={onChange}
        />
      </div>

      <div className="death-saves-box">
        <div className="death-saves-label">Death Saves</div>

        <div className="death-save-row">
          <span className="death-sub-label">Successes</span>
          {[0, 1, 2].map(i => (
            <input
              key={`success-${i}`}
              type="checkbox"
              className="death-checkbox"
              checked={values[`success-${i}`] || false}
              onChange={(e) => handleCheck('success', i, e.target.checked)}
            />
          ))}
        </div>

        <div className="death-save-row">
          <span className="death-sub-label">Failures</span>
          {[0, 1, 2].map(i => (
            <input
              key={`failure-${i}`}
              type="checkbox"
              className="death-checkbox"
              checked={values[`failure-${i}`] || false}
              onChange={(e) => handleCheck('failure', i, e.target.checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeathSaves;
