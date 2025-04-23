// AbilityScores.jsx

const abilities = [
    { name: 'Strength', short: 'STR' },
    { name: 'Dexterity', short: 'DEX' },
    { name: 'Constitution', short: 'CON' },
    { name: 'Intelligence', short: 'INT' },
    { name: 'Wisdom', short: 'WIS' },
    { name: 'Charisma', short: 'CHA' }
  ];
  
  const AbilityScores = () => {
    return (
      <section className="ability-scores">
        {abilities.map((ability) => (
          <div key={ability.short} className="ability-box">
            <label htmlFor={`${ability.short.toLowerCase()}score`} className="ability-label">
              {ability.name}
            </label>
            <input
              name={`${ability.short.toLowerCase()}score`}
              className="ability-score-input"
              placeholder="10"
            />
            <input
              name={`${ability.short.toLowerCase()}mod`}
              className="ability-mod-input"
              placeholder="+0"
            />
          </div>
        ))}
      </section>
    );
  };
  
  export default AbilityScores;
  