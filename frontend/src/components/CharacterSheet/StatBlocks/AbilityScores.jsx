// AbilityScores.jsx

const abilities = [
  { name: 'Strength', short: 'STR' },
  { name: 'Dexterity', short: 'DEX' },
  { name: 'Constitution', short: 'CON' },
  { name: 'Intelligence', short: 'INT' },
  { name: 'Wisdom', short: 'WIS' },
  { name: 'Charisma', short: 'CHA' },
];

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
