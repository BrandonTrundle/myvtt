import React, { useState, useEffect } from 'react';

const defaultRows = [
  { name: '', atk: '', damage: '', type: '' },
  { name: '', atk: '', damage: '', type: '' },
  { name: '', atk: '', damage: '', type: '' }
];

const AttackSection = ({ values, onChange }) => {
  const [rows, setRows] = useState(() => values.attacks?.length ? values.attacks : defaultRows);

  useEffect(() => {
    // 🔥 Only set if the values.attacks is not the same as our rows
    if (values.attacks && JSON.stringify(values.attacks) !== JSON.stringify(rows)) {
      console.log('🔄 Incoming attack values different, updating rows');
      setRows(values.attacks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.attacks]); // (only watching the incoming values)

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
