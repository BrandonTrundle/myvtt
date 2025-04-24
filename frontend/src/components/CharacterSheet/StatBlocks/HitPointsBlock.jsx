// HitPointsBlock.jsx

const HitPointsBlock = ({ values, onChange }) => {
  return (
    <div className="hit-points-section">
      <div className="hp-regular">
        <label htmlFor="maxhp" className="hp-label small">Hit Point Maximum</label>
        <input
          name="maxhp"
          className="hp-max"
          value={values.maxhp || ''}
          onChange={onChange}
        />

        <label htmlFor="currenthp" className="hp-label">Current Hit Points</label>
        <input
          name="currenthp"
          className="hp-current"
          value={values.currenthp || ''}
          onChange={onChange}
        />
      </div>

      <div className="hp-temp">
        <label htmlFor="temphp" className="hp-label">Temporary Hit Points</label>
        <input
          name="temphp"
          className="hp-temp-input"
          value={values.temphp || ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default HitPointsBlock;
