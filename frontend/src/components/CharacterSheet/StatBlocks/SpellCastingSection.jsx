// components/CharacterSheet/StatBlocks/SpellcastingSection.jsx

import SpellLevelBlock from './SpellLevelBlock';

const SpellcastingSection = ({ values, onChange }) => {
  return (
    <div className="spellcasting-section">
      {Array.from({ length: 10 }).map((_, level) => (
        <SpellLevelBlock
          key={level}
          level={level}
          values={values}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default SpellcastingSection;
