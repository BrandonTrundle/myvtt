const savingThrows = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma'
];

const SavingThrowsOnlyBlock = ({ values, onChange }) => {
  const handleCheck = (name, checked) => {
    onChange({
      target: {
        name,
        value: checked
      }
    });
  };

  return (
    <div className="saving-throws-box">
      <div className="saving-throws-label">Saving Throws</div>
      {savingThrows.map(attr => {
        const key = attr.toLowerCase();
        return (
          <div key={attr} className="saving-throw-row">
            <input
              type="checkbox"
              name={`${key}-save-prof`}
              className="save-checkbox"
              checked={values[`${key}-save-prof`] || false}
              onChange={(e) => handleCheck(`${key}-save-prof`, e.target.checked)}
            />
            <input
              type="text"
              name={`${key}-save`}
              className="save-input"
              value={values[`${key}-save`] || ''}
              onChange={onChange}
            />
            <label htmlFor={`${key}-save`} className="save-label">
              {attr}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default SavingThrowsOnlyBlock;
