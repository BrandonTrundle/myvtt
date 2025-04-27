/**
 * Author: Brandon Trundle
 * File Name: FeaturesAndTraits.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides a text area for users to list and describe special features, racial traits, class abilities,
 * or other unique attributes of their character.
 */

import React from 'react'; // React library for rendering functional components and forms

/**
 * FeaturesAndTraits Component
 * 
 * Purpose:
 * Renders a labeled textarea input for writing out character features and traits.
 * 
 * Props:
 * @param {Object} values - Object containing the current features and traits text.
 * @param {Function} onChange - Callback function to update the parent form state when features are edited.
 * 
 * Behavior:
 * - Displays a textarea pre-filled with any existing features and traits data.
 * - Updates the parent form's state on user edits through the provided `onChange` handler.
 */
const FeaturesAndTraits = ({ values, onChange }) => {
  return (
    <div className="features-box">
      <label htmlFor="features" className="features-label">
        Features & Traits
      </label>
      <textarea
        name="features"
        className="features-textarea"
        rows="12"
        value={values.features || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default FeaturesAndTraits;
