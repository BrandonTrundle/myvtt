/**
 * Author: Brandon Trundle
 * File Name: PersonalityTraits.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders fields for entering a character's key personality descriptors,
 * including Personality Traits, Ideals, Bonds, and Flaws.
 */

import React from 'react'; // React library for building structured form components

const traits = [
  { name: 'personalityTraits', label: 'Personality Traits' },
  { name: 'ideals', label: 'Ideals' },
  { name: 'bonds', label: 'Bonds' },
  { name: 'flaws', label: 'Flaws' }
];

/**
 * PersonalityTraits Component
 * 
 * Purpose:
 * Provides labeled textareas for a character's roleplaying attributes: traits, ideals, bonds, and flaws.
 * 
 * Props:
 * @param {Object} values - Object containing the current values for each personality field.
 * @param {Function} onChange - Callback function to update the parent form when any trait value changes.
 * 
 * Behavior:
 * - Displays a textarea for each personality category.
 * - Updates the parent form state on input through the provided `onChange` handler.
 */
const PersonalityTraits = ({ values, onChange }) => {
  return (
    <div className="traits-container">
      {traits.map(trait => (
        <div key={trait.name} className="trait-block">
          <label htmlFor={trait.name} className="trait-label">{trait.label}</label>
          <textarea
            name={trait.name}
            className="trait-textarea"
            rows="4"
            value={values[trait.name] || ''}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
};

export default PersonalityTraits;
