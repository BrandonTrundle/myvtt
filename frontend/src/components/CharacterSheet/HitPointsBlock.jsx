// HitPointsBlock.jsx

const HitPointsBlock = () => {
    return (
      <div className="hit-points-section">
        <div className="hp-regular">
          <label htmlFor="maxhp" className="hp-label small">Hit Point Maximum</label>
          <input name="maxhp" placeholder="10" className="hp-max" />
  
          <label htmlFor="currenthp" className="hp-label">Current Hit Points</label>
          <input name="currenthp" placeholder="10" className="hp-current" />
        </div>
  
        <div className="hp-temp">
          <label htmlFor="temphp" className="hp-label">Temporary Hit Points</label>
          <input name="temphp" placeholder="0" className="hp-temp-input" />
        </div>
      </div>
    );
  };
  
  export default HitPointsBlock;