const PhysicalAttributesBlock = ({ values, onChange }) => {
  return (
    <div className="physical-attributes-block">
      <div className="row">
        <div className="field">
          <input
            name="age"
            placeholder="Age"
            className="input"
            value={values.age || ''}
            onChange={onChange}
          />
          <label>AGE</label>
        </div>
        <div className="field">
          <input
            name="height"
            placeholder="Height"
            className="input"
            value={values.height || ''}
            onChange={onChange}
          />
          <label>HEIGHT</label>
        </div>
        <div className="field">
          <input
            name="weight"
            placeholder="Weight"
            className="input"
            value={values.weight || ''}
            onChange={onChange}
          />
          <label>WEIGHT</label>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <input
            name="eyes"
            placeholder="Eyes"
            className="input"
            value={values.eyes || ''}
            onChange={onChange}
          />
          <label>EYES</label>
        </div>
        <div className="field">
          <input
            name="skin"
            placeholder="Skin"
            className="input"
            value={values.skin || ''}
            onChange={onChange}
          />
          <label>SKIN</label>
        </div>
        <div className="field">
          <input
            name="hair"
            placeholder="Hair"
            className="input"
            value={values.hair || ''}
            onChange={onChange}
          />
          <label>HAIR</label>
        </div>
      </div>
    </div>
  );
};

export default PhysicalAttributesBlock;
