// DeathSaves.jsx

const DeathSaves = () => {
    return (
      <div className="death-saves-container">
        <div className="hit-dice-box">
          <label htmlFor="hitdice" className="death-label">Hit Dice</label>
          <input name="hitdice" placeholder="2d10" className="hit-dice-input" />
        </div>
  
        <div className="death-saves-box">
          <div className="death-saves-label">Death Saves</div>
  
          <div className="death-save-row">
            <span className="death-sub-label">Successes</span>
            {[0, 1, 2].map(i => (
              <input type="checkbox" key={`success-${i}`} className="death-checkbox" />
            ))}
          </div>
  
          <div className="death-save-row">
            <span className="death-sub-label">Failures</span>
            {[0, 1, 2].map(i => (
              <input type="checkbox" key={`failure-${i}`} className="death-checkbox" />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default DeathSaves;
  