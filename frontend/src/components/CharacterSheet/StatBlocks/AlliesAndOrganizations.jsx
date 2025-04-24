import { useState, useEffect } from 'react';

const AlliesAndOrganizations = ({ values, onChange }) => {
  const [symbolImage, setSymbolImage] = useState(values.orgSymbolImage || '');

  useEffect(() => {
    onChange({ target: { name: 'orgSymbolImage', value: symbolImage } });
  }, [symbolImage, onChange]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSymbolImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="allies-orgs-block">
      <label htmlFor="allies">Allies & Organizations</label>
      <textarea
        id="allies"
        name="allies"
        className="allies-textarea"
        placeholder="Details about allies, factions, and groups your character is affiliated with..."
        value={values.allies || ''}
        onChange={onChange}
      />

      <div className="org-symbol-row">
        <div className="field">
          <label htmlFor="orgName">Name</label>
          <input
            name="orgName"
            id="orgName"
            className="org-input"
            placeholder="Organization Name"
            value={values.orgName || ''}
            onChange={onChange}
          />
        </div>
        <div className="field">
          <label htmlFor="orgSymbolUpload">Symbol</label>
          {symbolImage && (
            <img
              src={symbolImage}
              alt="Symbol Preview"
              className="symbol-preview"
            />
          )}
          <input
            type="file"
            accept="image/*"
            id="orgSymbolUpload"
            onChange={handleImageUpload}
          />
          <input type="hidden" name="orgSymbolImage" value={symbolImage || ''} />
        </div>
      </div>
    </div>
  );
};

export default AlliesAndOrganizations;
