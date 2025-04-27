/**
 * Author: Brandon Trundle
 * File Name: CharacterHeader.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders the top section of the character sheet where players input their character's basic information,
 * such as name, class, level, race, alignment, background, and experience points.
 */

import React from 'react'; // React library for building UI components and handling form inputs

/**
 * CharacterHeader Component
 * 
 * Purpose:
 * Provides labeled input fields for key character metadata.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current header form values.
 * @param {Function} onChange - Callback function to handle changes to any header field input.
 * 
 * Behavior:
 * - Displays inputs for Character Name and Experience Points at the top.
 * - Dynamically renders a grid of inputs for Class, Level, Background, Player Name, Race, and Alignment.
 * - Updates the parent form's state with any changes made by the user.
 */
const CharacterHeader = ({ values, onChange }) => {
  const fields = [
    { name: 'class', label: 'Class', placeholder: '' },
    { name: 'level', label: 'Level', placeholder: '', type: 'number' },
    { name: 'background', label: 'Background', placeholder: '' },
    { name: 'playername', label: 'Player Name', placeholder: '' },
    { name: 'race', label: 'Race', placeholder: '' },
    { name: 'alignment', label: 'Alignment', placeholder: '' },
  ];

  return (
    <header className="character-header">
      <section className="charname-section">
        <label htmlFor="charname" className="charname-label">
          Character Name
        </label>
        <input
          name="charname"
          placeholder=""
          className="charname-input"
          value={values.charname || ''}
          onChange={onChange}
        />

        <label htmlFor="experiencepoints" className="charinfo-label" style={{ marginTop: '12px' }}>
          Experience Points
        </label>
        <input
          name="experiencepoints"
          placeholder=""
          className="charinfo-input"
          value={values.experiencepoints || ''}
          onChange={onChange}
        />
      </section>

      <section className="charinfo-grid">
        {fields.map(({ name, label, placeholder, type = 'text' }) => (
          <div key={name} className="charinfo-field">
            <label htmlFor={name} className="charinfo-label">
              {label}
            </label>
            <input
              name={name}
              placeholder={placeholder}
              className="charinfo-input"
              type={type}
              value={values[name] || ''}
              onChange={onChange}
            />
          </div>
        ))}
      </section>
    </header>
  );
};

export default CharacterHeader;
