// components/CharacterSheet/StatBlocks/SpellcastingInfoBlock.jsx

const SpellcastingInfoBlock = ({ values, onChange }) => {
  return (
    <div className="spellcasting-info-block">
      <div className="spellcasting-row">
        <div className="field wide">
          <input
            type="text"
            name="spellcastingClass"
            placeholder="Spellcasting Class"
            className="input"
            value={values.spellcastingClass || ''}
            onChange={onChange}
          />
          <label>Spellcasting Class</label>
        </div>

        <div className="compact-row">
          <div className="field">
            <input
              type="text"
              name="spellcastingAbility"
              placeholder="Ability"
              className="input"
              value={values.spellcastingAbility || ''}
              onChange={onChange}
            />
            <label>Spellcasting Ability</label>
          </div>
          <div className="field">
            <input
              type="number"
              name="spellSaveDC"
              placeholder="DC"
              className="input"
              value={values.spellSaveDC || ''}
              onChange={onChange}
            />
            <label>Spell Save DC</label>
          </div>
          <div className="field">
            <input
              type="number"
              name="spellAttackBonus"
              placeholder="Bonus"
              className="input"
              value={values.spellAttackBonus || ''}
              onChange={onChange}
            />
            <label>Spell Attack Bonus</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellcastingInfoBlock;
