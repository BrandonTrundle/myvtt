/**
 * Author: Brandon Trundle
 * File Name: PhysicalAttributesBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides input fields for a character's core physical attributes,
 * including age, height, weight, eye color, skin tone, and hair color.
 */

import React from 'react'; // React library for building reusable UI form components

/**
 * PhysicalAttributesBlock Component
 * 
 * Purpose:
 * Renders editable fields for a character's physical description and basic biological stats.
 * 
 * Props:
 * @param {Object} values - Object containing the current values for all physical attributes.
 * @param {Function} onChange - Callback function to update the form state when attribute fields are changed.
 * 
 * Behavior:
 * - Displays inputs organized into two rows for better layout.
 * - Updates the parent form's state whenever a field is edited.
 */
const PhysicalAttributesBlock = ({ values, onChange }) => {
  return (
    <div className="physical-attributes-block">
      <div className="row">
        <div className="field">
          <input
            name="age"
            placeholder="Age"
            className="input"
            value={values.age || ''}
            onChange={onChange}
          />
          <label>AGE</label>
        </div>
        <div className="field">
          <input
            name="height"
            placeholder="Height"
            className="input"
            value={values.height || ''}
            onChange={onChange}
          />
          <label>HEIGHT</label>
        </div>
        <div className="field">
          <input
            name="weight"
            placeholder="Weight"
            className="input"
            value={values.weight || ''}
            onChange={onChange}
          />
          <label>WEIGHT</label>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <input
            name="eyes"
            placeholder="Eyes"
            className="input"
            value={values.eyes || ''}
            onChange={onChange}
          />
          <label>EYES</label>
        </div>
        <div className="field">
          <input
            name="skin"
            placeholder="Skin"
            className="input"
            value={values.skin || ''}
            onChange={onChange}
          />
          <label>SKIN</label>
        </div>
        <div className="field">
          <input
            name="hair"
            placeholder="Hair"
            className="input"
            value={values.hair || ''}
            onChange={onChange}
          />
          <label>HAIR</label>
        </div>
      </div>
    </div>
  );
};

export default PhysicalAttributesBlock;
