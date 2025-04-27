/**
 * Author: Brandon Trundle
 * File Name: CombatStats.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders and manages the input fields for a character's core combat statistics:
 * Armor Class (AC), Initiative, and Speed.
 */

import React from 'react'; // React library for component rendering and form control

/**
 * CombatStats Component
 * 
 * Purpose:
 * Provides labeled input fields for key combat-related statistics on the character sheet.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current combat stat values.
 * @param {Function} onChange - Callback function to handle updates to any of the combat stat fields.
 * 
 * Behavior:
 * - Dynamically renders fields for Armor Class, Initiative, and Speed.
 * - Updates the parent form state through the provided `onChange` handler when user inputs change.
 */
const CombatStats = ({ values, onChange }) => {
  const stats = [
    { name: 'ac', label: 'Armor Class', placeholder: '' },
    { name: 'initiative', label: 'Initiative', placeholder: '' },
    { name: 'speed', label: 'Speed', placeholder: '' }
  ];

  return (
    <div className="combat-stats-box">
      <div className="combat-stats">
        {stats.map(stat => (
          <div key={stat.name} className="combat-stat-box">
            <label htmlFor={stat.name} className="combat-label">
              {stat.label}
            </label>
            <input
              type="text"
              name={stat.name}
              placeholder={stat.placeholder}
              className="combat-input"
              value={values[stat.name] || ''}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatStats;
