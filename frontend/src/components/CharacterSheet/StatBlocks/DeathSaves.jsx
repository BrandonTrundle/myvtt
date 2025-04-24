// components/CharacterSheet/StatBlocks/DeathSaves.jsx

const DeathSaves = ({ values, onChange }) => {
  const handleCheck = (type, index, checked) => {
    const key = `${type}-${index}`;
    onChange({
      target: {
        name: key,
        value: checked
      }
    });
  };

  return (
    <div className="death-saves-container">
      <div className="hit-dice-box">
        <label htmlFor="hitdice" className="death-label">Hit Dice</label>
        <input
          name="hitdice"
          placeholder=""
          className="hit-dice-input"
          value={values.hitdice || ''}
          onChange={onChange}
        />
      </div>

      <div className="death-saves-box">
        <div className="death-saves-label">Death Saves</div>

        <div className="death-save-row">
          <span className="death-sub-label">Successes</span>
          {[0, 1, 2].map(i => (
            <input
              key={`success-${i}`}
              type="checkbox"
              className="death-checkbox"
              checked={values[`success-${i}`] || false}
              onChange={(e) => handleCheck('success', i, e.target.checked)}
            />
          ))}
        </div>

        <div className="death-save-row">
          <span className="death-sub-label">Failures</span>
          {[0, 1, 2].map(i => (
            <input
              key={`failure-${i}`}
              type="checkbox"
              className="death-checkbox"
              checked={values[`failure-${i}`] || false}
              onChange={(e) => handleCheck('failure', i, e.target.checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeathSaves;
