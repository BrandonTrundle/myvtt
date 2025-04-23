// SavingThrowsOnlyBlock.jsx

const savingThrows = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma'
];

const SavingThrowsOnlyBlock = () => {
  return (
    <div className="saving-throws-box">
      <div className="saving-throws-label">Saving Throws</div>
      {savingThrows.map(attr => (
        <div key={attr} className="saving-throw-row">
          <input
            type="checkbox"
            name={`${attr.toLowerCase()}-save-prof`}
            className="save-checkbox"
          />
          <input
            type="text"
            name={`${attr.toLowerCase()}-save`}
            className="save-input"
            placeholder="+0"
          />
          <label
            htmlFor={`${attr.toLowerCase()}-save`}
            className="save-label"
          >
            {attr}
          </label>
        </div>
      ))}
    </div>
  );
};

export default SavingThrowsOnlyBlock;
