/**
 * Author: Brandon Trundle
 * File Name: AdditionalFeatures.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides a text area for entering any additional character features, traits, or bonuses that 
 * are not otherwise covered in the main character sheet fields.
 */

import React from 'react'; // React library for building components and using JSX

/**
 * AdditionalFeatures Component
 * 
 * Purpose:
 * Renders a labeled textarea input for entering miscellaneous character features and traits.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current form values.
 * @param {Function} onChange - Callback function for handling updates to the additional features field.
 * 
 * Behavior:
 * - Displays a multi-line textarea pre-filled with any existing 'additionalFeatures' value.
 * - Updates the parent form's state through the provided `onChange` handler when edited.
 */
const AdditionalFeatures = ({ values, onChange }) => {
  return (
    <div className="textblock">
      <div className="textblock-label">Additional Features & Traits</div>
      <textarea
        name="additionalFeatures"
        className="textblock-textarea"
        placeholder="List any additional traits, feats, or bonuses your character has..."
        value={values.additionalFeatures || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default AdditionalFeatures;
