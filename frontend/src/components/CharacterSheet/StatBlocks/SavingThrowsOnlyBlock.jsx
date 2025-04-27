/**
 * Author: Brandon Trundle
 * File Name: SavingThrowsOnlyBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays the saving throws section for a character, allowing users to set proficiency 
 * and manually adjust the saving throw modifiers for each ability.
 */

import React from 'react'; // React library for building form elements and component structure

const savingThrows = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma'
];

/**
 * SavingThrowsOnlyBlock Component
 * 
 * Purpose:
 * Renders checkboxes and input fields for each of the six core ability saving throws.
 * 
 * Props:
 * @param {Object} values - Object containing current proficiency and saving throw modifier values.
 * @param {Function} onChange - Callback function to update the parent form when saving throw data changes.
 * 
 * Behavior:
 * - Displays a checkbox to indicate saving throw proficiency for each ability.
 * - Provides an input field to manually set the saving throw bonus.
 * - Updates parent form state when checkboxes or input values change.
 */
const SavingThrowsOnlyBlock = ({ values, onChange }) => {

/**
 * Handles updating the proficiency checkbox for a specific saving throw.
 * 
 * @param {string} name - The name of the saving throw proficiency field.
 * @param {boolean} checked - Whether the proficiency checkbox is checked.
 */
  const handleCheck = (name, checked) => {
    onChange({
      target: {
        name,
        value: checked
      }
    });
  };

  return (
    <div className="saving-throws-box">
      <div className="saving-throws-label">Saving Throws</div>
      {savingThrows.map(attr => {
        const key = attr.toLowerCase();
        return (
          <div key={attr} className="saving-throw-row">
            <input
              type="checkbox"
              name={`${key}-save-prof`}
              className="save-checkbox"
              checked={values[`${key}-save-prof`] || false}
              onChange={(e) => handleCheck(`${key}-save-prof`, e.target.checked)}
            />
            <input
              type="text"
              name={`${key}-save`}
              className="save-input"
              value={values[`${key}-save`] || ''}
              onChange={onChange}
            />
            <label htmlFor={`${key}-save`} className="save-label">
              {attr}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default SavingThrowsOnlyBlock;
