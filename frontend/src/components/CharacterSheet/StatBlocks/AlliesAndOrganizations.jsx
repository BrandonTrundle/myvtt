/**
 * Author: Brandon Trundle
 * File Name: AlliesAndOrganizations.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Allows users to input details about their character's allies, factions, and organizations.
 * Provides support for uploading a symbolic image representing an organization.
 */



/**
 * AlliesAndOrganizations Component
 * 
 * Purpose:
 * Renders a section for users to document their character's allies and organizational affiliations.
 * Supports both textual descriptions and image upload for an organization's symbol.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current form values, including allies, organization name, and organization symbol.
 * @param {Function} onChange - Callback function for handling updates to all inputs within this component.
 * 
 * Behavior:
 * - Provides a textarea for listing allies and affiliations.
 * - Provides an input for the organization's name.
 * - Supports image upload for the organization's symbol (base64-encoded).
 * - On image selection, automatically updates the parent form's data structure with the encoded image.
 * 
 * Important Fields:
 * - allies: Text description of allies and factions.
 * - orgName: Name of the primary organization or faction.
 * - orgSymbolImage: Base64-encoded image string representing the organization's symbol.
 */
const AlliesAndOrganizations = ({ values, onChange }) => {
  const symbolImage = values.orgSymbolImage || '';
  
/**
 * Handles reading the uploaded image and sending it as a Base64 string to the parent component.
 */
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
