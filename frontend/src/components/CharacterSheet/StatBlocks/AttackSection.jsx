// AttackSection.jsx

import React, { useState, useEffect } from 'react';

const defaultRows = [
  { name: '', atk: '', damage: '', type: '' },
  { name: '', atk: '', damage: '', type: '' },
  { name: '', atk: '', damage: '', type: '' }
];

const AttackSection = ({ values, onChange }) => {
  const [rows, setRows] = useState(values.attacks || defaultRows);

  useEffect(() => {
    // Update parent formData whenever rows change
    console.log("🧠 Attack rows updated:", rows);
    onChange({
      target: {
        name: 'attacks',
        value: rows
      }
    });
  }, [rows]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { name: '', atk: '', damage: '', type: '' }]);
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
