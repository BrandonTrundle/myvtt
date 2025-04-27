/**
 * Author: Brandon Trundle
 * File Name: AttackSection.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays and manages the list of attacks and spells for a character.
 * Supports dynamic addition, editing, and syncing of attack data with the parent form.
 */

import React, { useState, useEffect } from 'react'; // React library and hooks for managing component state and side effects

/**
 * Default structure for new attack/spell rows.
 */
const defaultRows = [
  { name: '', atk: '', damage: '', type: '' },
  { name: '', atk: '', damage: '', type: '' },
  { name: '', atk: '', damage: '', type: '' }
];

/**
 * AttackSection Component
 * 
 * Purpose:
 * Renders a dynamic table where users can input multiple attacks or spells,
 * and optionally add additional notes for special cases.
 * 
 * Props:
 * @param {Object} values - Object containing the character's attack values and notes.
 * @param {Function} onChange - Callback to update the parent form state when attacks change.
 */
const AttackSection = ({ values, onChange }) => {
  const [rows, setRows] = useState(() => values.attacks?.length ? values.attacks : defaultRows);

/**
 * Syncs incoming attack values from the parent form to local rows state.
 */
  useEffect(() => {
    // 🔥 Only set if the values.attacks is not the same as our rows
    if (values.attacks && JSON.stringify(values.attacks) !== JSON.stringify(rows)) {
      console.log('🔄 Incoming attack values different, updating rows');
      setRows(values.attacks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.attacks]); // (only watching the incoming values)

/**
 * Handles updating an individual attack row field.
 * 
 * @param {number} index - Index of the row being edited.
 * @param {string} field - Name of the field being updated (name, atk, damage, type).
 * @param {string} value - New value entered by the user.
 */
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
    onChange({
      target: {
        name: 'attacks',
        value: updated,
      },
    });
  };
  
/**
 * Adds a new blank row for an additional attack or spell.
 */
  const addRow = () => {
    const updated = [...rows, { name: '', atk: '', damage: '', type: '' }];
    setRows(updated);
    onChange({
      target: {
        name: 'attacks',
        value: updated,
      },
    });
  };

  return (
    <section className="attack-section">
      <div className="attack-grid">
        <div className="attack-label">Name</div>
        <div className="attack-label">Atk Bonus</div>
        <div className="attack-label">Damage</div>
        <div className="attack-label">Type</div>

        {rows.map((row, index) => (
          <React.Fragment key={index}>
            <input
              type="text"
              className="attack-name"
              value={row.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              className="attack-bonus"
              value={row.atk}
              onChange={(e) => handleChange(index, 'atk', e.target.value)}
            />
            <input
              type="text"
              className="attack-input"
              value={row.damage}
              onChange={(e) => handleChange(index, 'damage', e.target.value)}
            />
            <input
              type="text"
              className="attack-input"
              value={row.type}
              onChange={(e) => handleChange(index, 'type', e.target.value)}
            />
          </React.Fragment>
        ))}
      </div>

      <textarea
        className="attack-textarea"
        name="attack-notes"
        placeholder="Additional attack/spell info..."
        value={values['attack-notes'] || ''}
        onChange={onChange}
      ></textarea>

      <div className="attack-actions">
        <button type="button" className="add-attack-btn" onClick={addRow}>
          + Add Attack/Spell
        </button>
      </div>
    </section>
  );
};

export default AttackSection;
