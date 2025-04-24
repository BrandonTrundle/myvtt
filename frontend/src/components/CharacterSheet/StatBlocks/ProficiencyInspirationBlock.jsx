// ProficiencyInspirationBlock.jsx

const ProficiencyInspirationBlock = ({ values, onChange }) => {
  return (
    <div className="proficiency-inspiration-box">
      <div className="core-box">
        <label htmlFor="inspiration" className="core-label">Inspiration</label>
        <input
          name="inspiration"
          placeholder=""
          className="core-input"
          value={values.inspiration || ''}
          onChange={onChange}
        />
      </div>

      <div className="core-box" style={{ marginTop: '12px' }}>
        <label htmlFor="proficiencybonus" className="core-label">Proficiency Bonus</label>
        <input
          name="proficiencybonus"
          placeholder=""
          className="core-input"
          value={values.proficiencybonus || ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ProficiencyInspirationBlock;
