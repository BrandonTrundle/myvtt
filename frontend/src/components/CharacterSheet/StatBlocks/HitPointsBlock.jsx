/**
 * Author: Brandon Trundle
 * File Name: HitPointsBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders the character's hit points section, including maximum hit points, current hit points,
 * and temporary hit points during gameplay.
 */

import React from 'react'; // React library for managing form-driven UI components

/**
 * HitPointsBlock Component
 * 
 * Purpose:
 * Provides input fields for recording and updating a character's hit point values.
 * 
 * Props:
 * @param {Object} values - Object containing the current hit point-related values (maxhp, currenthp, temphp).
 * @param {Function} onChange - Callback function to update the form state when hit point fields are modified.
 * 
 * Behavior:
 * - Displays editable inputs for maximum hit points, current hit points, and temporary hit points.
 * - Updates the parent form's state on user input through the `onChange` handler.
 */
const HitPointsBlock = ({ values, onChange }) => {
  return (
    <div className="hit-points-section">
      <div className="hp-regular">
        <label htmlFor="maxhp" className="hp-label small">Hit Point Maximum</label>
        <input
          name="maxhp"
          className="hp-max"
          value={values.maxhp || ''}
          onChange={onChange}
        />

        <label htmlFor="currenthp" className="hp-label">Current Hit Points</label>
        <input
          name="currenthp"
          className="hp-current"
          value={values.currenthp || ''}
          onChange={onChange}
        />
      </div>

      <div className="hp-temp">
        <label htmlFor="temphp" className="hp-label">Temporary Hit Points</label>
        <input
          name="temphp"
          className="hp-temp-input"
          value={values.temphp || ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default HitPointsBlock;
