const SpellLevelBlock = ({ level, values, onChange }) => {
  const label = level === 0 ? 'Cantrips' : `Level ${level}`;
  const slotsName = `spellSlots_${level}`;
  const spellsName = `spells_${level}`;

  return (
    <div className="spell-level-block">
      <div className="spell-level-header">
        <span className="spell-level-label">{label}</span>
        {level > 0 && (
          <input
            type="number"
            name={slotsName}
            className="spell-slot-input"
            placeholder="Slots"
            min="0"
            value={values[slotsName] || ''}
            onChange={onChange}
          />
        )}
      </div>
      <textarea
        name={spellsName}
        className="spell-textarea"
        placeholder={`Enter ${label.toLowerCase()} here...`}
        value={values[spellsName] || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default SpellLevelBlock;
