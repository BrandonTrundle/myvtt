import { useEffect } from 'react';

const AlliesAndOrganizations = ({ values, onChange }) => {
  const symbolImage = values.orgSymbolImage || '';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        // 👇 Immediately update formData
        onChange({ target: { name: 'orgSymbolImage', value: result } });
      };
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
        onChange={(e) => onChange(e)}
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
            onChange={(e) => onChange(e)}
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
          <input type="hidden" name="orgSymbolImage" value={symbolImage} />
        </div>
      </div>
    </div>
  );
};

export default AlliesAndOrganizations;
