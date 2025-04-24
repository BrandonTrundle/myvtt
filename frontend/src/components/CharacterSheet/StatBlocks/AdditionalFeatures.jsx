// components/CharacterSheet/StatBlocks/AdditionalFeatures.jsx

const AdditionalFeatures = ({ values, onChange }) => {
  return (
    <div className="textblock">
      <div className="textblock-label">Additional Features & Traits</div>
      <textarea
        name="additionalFeatures"
        className="textblock-textarea"
        placeholder="List any additional traits, feats, or bonuses your character has..."
        value={values.additionalFeatures || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default AdditionalFeatures;
