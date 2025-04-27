/**
 * Author: Brandon Trundle
 * File Name: CharacterBackstory.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides a text area for writing a detailed backstory for the character,
 * including their history, motivations, and important life events.
 */

import React from 'react'; // React library for building components and handling JSX

/**
 * CharacterBackstory Component
 * 
 * Purpose:
 * Renders a labeled textarea input for users to compose their character's personal backstory.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current form values.
 * @param {Function} onChange - Callback function to handle updates to the backstory field.
 * 
 * Behavior:
 * - Displays a textarea pre-populated with the existing backstory value if provided.
 * - Updates the parent form's state with any changes entered by the user.
 */
const CharacterBackstory = ({ values, onChange }) => {
  return (
    <div className="textblock">
      <div className="textblock-label">Character Backstory</div>
      <textarea
        name="backstory"
        className="textblock-textarea"
        placeholder="Write a detailed backstory for your character..."
        value={values.backstory || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default CharacterBackstory;
