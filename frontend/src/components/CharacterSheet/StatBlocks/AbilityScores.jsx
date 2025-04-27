/**
 * Author: Brandon Trundle
 * File Name: AbilityScores.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays the six core ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) 
 * and their associated modifiers. 
 * Provides controlled inputs to update the character's ability scores and modifiers dynamically.
 */

import React from 'react'; // React library for component creation and JSX support

/**
 * Array of standard Dungeons & Dragons 5e ability scores.
 * 
 * Each object includes:
 * - name: Full name of the ability
 * - short: Common three-letter abbreviation
 */
const abilities = [
  { name: 'Strength', short: 'STR' },
  { name: 'Dexterity', short: 'DEX' },
  { name: 'Constitution', short: 'CON' },
  { name: 'Intelligence', short: 'INT' },
  { name: 'Wisdom', short: 'WIS' },
  { name: 'Charisma', short: 'CHA' },
];

/**
 * AbilityScores Component
 * 
 * Purpose:
 * Renders a section for user input of all six ability scores and their corresponding modifiers.
 * 
 * Props:
 * @param {Object} values - An object containing current ability score and modifier values keyed by field names (e.g., 'strscore', 'strmod').
 * @param {Function} onChange - Callback function to handle user input changes for both scores and modifiers.
 * 
 * Behavior:
 * - Maps over the standard abilities and creates a labeled input for each score and modifier.
 * - Values are controlled by the passed-in `values` prop.
 * - All changes are propagated through the `onChange` prop.
 * 
 * Expected Input Field Names:
 * - Ability scores: `${short}score` (e.g., "strscore", "dexscore")
 * - Ability modifiers: `${short}mod` (e.g., "strmod", "dexmod")
 */
const AbilityScores = ({ values, onChange }) => {
  return (
    <section className="ability-scores">
      {abilities.map((ability) => {
        const scoreName = `${ability.short.toLowerCase()}score`;
        const modName = `${ability.short.toLowerCase()}mod`;

        return (
          <div key={ability.short} className="ability-box">
            <label htmlFor={scoreName} className="ability-label">
              {ability.name}
            </label>
            <input
              name={scoreName}
              className="ability-score-input"
              placeholder=""
              value={values[scoreName] || ''}
              onChange={onChange}
            />
            <input
              name={modName}
              className="ability-mod-input"
              placeholder="+0"
              value={values[modName] || ''}
              onChange={onChange}
            />
          </div>
        );
      })}
    </section>
  );
};

export default AbilityScores;
