const WisdomAndProficiencies = ({ values, onChange }) => {
  return (
    <div className="wisdom-proficiencies-section">
      <div className="wisdom-box">
        <label htmlFor="passiveWisdom" className="wisdom-label">Passive Wisdom</label>
        <input
          type="text"
          name="passiveWisdom"
          className="wisdom-input"
          placeholder="e.g. 13"
          value={values.passiveWisdom || ''}
          onChange={onChange}
        />
      </div>

      <div className="proficiencies-box">
        <label htmlFor="otherProficiencies" className="proficiencies-label">
          Other Proficiencies & Languages
        </label>
        <textarea
          name="otherProficiencies"
          className="proficiencies-textarea"
          rows="5"
          placeholder="List any tool proficiencies, languages, etc."
          value={values.otherProficiencies || ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default WisdomAndProficiencies;
