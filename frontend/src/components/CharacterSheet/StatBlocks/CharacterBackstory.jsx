// components/CharacterSheet/StatBlocks/CharacterBackstory.jsx

const CharacterBackstory = ({ values, onChange }) => {
  return (
    <div className="textblock">
      <div className="textblock-label">Character Backstory</div>
      <textarea
        name="backstory"
        className="textblock-textarea"
        placeholder="Write a detailed backstory for your character..."
        value={values.backstory || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default CharacterBackstory;
