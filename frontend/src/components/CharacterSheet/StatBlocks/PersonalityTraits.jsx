const traits = [
  { name: 'personalityTraits', label: 'Personality Traits' },
  { name: 'ideals', label: 'Ideals' },
  { name: 'bonds', label: 'Bonds' },
  { name: 'flaws', label: 'Flaws' }
];

const PersonalityTraits = ({ values, onChange }) => {
  return (
    <div className="traits-container">
      {traits.map(trait => (
        <div key={trait.name} className="trait-block">
          <label htmlFor={trait.name} className="trait-label">{trait.label}</label>
          <textarea
            name={trait.name}
            className="trait-textarea"
            rows="4"
            value={values[trait.name] || ''}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
};

export default PersonalityTraits;
