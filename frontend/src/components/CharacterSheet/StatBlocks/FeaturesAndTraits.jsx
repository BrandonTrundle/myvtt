const FeaturesAndTraits = ({ values, onChange }) => {
  return (
    <div className="features-box">
      <label htmlFor="features" className="features-label">
        Features & Traits
      </label>
      <textarea
        name="features"
        className="features-textarea"
        rows="12"
        value={values.features || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default FeaturesAndTraits;
