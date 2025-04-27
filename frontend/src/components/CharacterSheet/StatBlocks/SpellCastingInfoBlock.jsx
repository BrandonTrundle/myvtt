/**
 * Author: Brandon Trundle
 * File Name: SpellcastingInfoBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides input fields for a character's basic spellcasting information,
 * including class, spellcasting ability, spell save DC, and spell attack bonus.
 */

import React from 'react'; // React library for creating input-driven components

/**
 * SpellcastingInfoBlock Component
 * 
 * Purpose:
 * Renders labeled fields for key spellcasting statistics used during gameplay.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current spellcasting-related values.
 * @param {Function} onChange - Callback function to update the form state when spellcasting fields change.
 * 
 * Behavior:
 * - Displays editable fields for spellcasting class, ability, save DC, and attack bonus.
 * - Updates the parent form's state on user input through the provided `onChange` handler.
 */
const SpellcastingInfoBlock = ({ values, onChange }) => {
  return (
    <div className="spellcasting-info-block">
      <div className="spellcasting-row">
        <div className="field wide">
          <input
            type="text"
            name="spellcastingClass"
            placeholder="Spellcasting Class"
            className="input"
            value={values.spellcastingClass || ''}
            onChange={onChange}
          />
          <label>Spellcasting Class</label>
        </div>

        <div className="compact-row">
          <div className="field">
            <input
              type="text"
              name="spellcastingAbility"
              placeholder="Ability"
              className="input"
              value={values.spellcastingAbility || ''}
              onChange={onChange}
            />
            <label>Spellcasting Ability</label>
          </div>
          <div className="field">
            <input
              type="number"
              name="spellSaveDC"
              placeholder="DC"
              className="input"
              value={values.spellSaveDC || ''}
              onChange={onChange}
            />
            <label>Spell Save DC</label>
          </div>
          <div className="field">
            <input
              type="number"
              name="spellAttackBonus"
              placeholder="Bonus"
              className="input"
              value={values.spellAttackBonus || ''}
              onChange={onChange}
            />
            <label>Spell Attack Bonus</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellcastingInfoBlock;
