// ProficiencyInspirationBlock.jsx

const ProficiencyInspirationBlock = () => {
    return (
      <div className="proficiency-inspiration-box">
        <div className="core-box">
          <label htmlFor="inspiration" className="core-label">Inspiration</label>
          <input name="inspiration" placeholder="0" className="core-input" />
        </div>
  
        <div className="core-box" style={{ marginTop: '12px' }}>
          <label htmlFor="proficiencybonus" className="core-label">Proficiency Bonus</label>
          <input name="proficiencybonus" placeholder="+2" className="core-input" />
        </div>
      </div>
    );
  };
  
  export default ProficiencyInspirationBlock;
  