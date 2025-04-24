// components/CharacterSheet/StatBlocks/CharacterAppearance.jsx

const CharacterAppearance = ({ values, onChange }) => {
  return (
    <div className="character-appearance-block">
      <label htmlFor="appearance">Character Appearance</label>
      <textarea
        id="appearance"
        name="appearance"
        className="appearance-textarea"
        placeholder="Describe your character's appearance..."
        value={values.appearance || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default CharacterAppearance;
