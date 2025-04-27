/**
 * Author: Brandon Trundle
 * File Name: CharacterAppearance.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides a text area for describing a character's visual appearance,
 * including physical traits, clothing, and distinguishing features.
 */

import React from 'react'; // React library for component building and JSX syntax

/**
 * CharacterAppearance Component
 * 
 * Purpose:
 * Renders a labeled textarea input for users to describe their character's appearance.
 * 
 * Props:
 * @param {Object} values - Object containing the current character form values.
 * @param {Function} onChange - Callback function to update form state when appearance description changes.
 * 
 * Behavior:
 * - Displays a textarea pre-filled with the character's current appearance description (if any).
 * - Propagates changes upward through the provided `onChange` handler.
 */
const CharacterAppearance = ({ values, onChange }) => {
  return (
    <div className="character-appearance-block">
      <label htmlFor="appearance">Character Appearance</label>
      <textarea
        id="appearance"
        name="appearance"
        className="appearance-textarea"
        placeholder="Describe your character's appearance..."
        value={values.appearance || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default CharacterAppearance;
