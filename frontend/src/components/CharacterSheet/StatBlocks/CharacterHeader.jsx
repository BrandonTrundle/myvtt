const CharacterHeader = ({ values, onChange }) => {
  const fields = [
    { name: 'class', label: 'Class', placeholder: '' },
    { name: 'level', label: 'Level', placeholder: '', type: 'number' },
    { name: 'background', label: 'Background', placeholder: '' },
    { name: 'playername', label: 'Player Name', placeholder: '' },
    { name: 'race', label: 'Race', placeholder: '' },
    { name: 'alignment', label: 'Alignment', placeholder: '' },
  ];

  return (
    <header className="character-header">
      <section className="charname-section">
        <label htmlFor="charname" className="charname-label">
          Character Name
        </label>
        <input
          name="charname"
          placeholder=""
          className="charname-input"
          value={values.charname || ''}
          onChange={onChange}
        />

        <label htmlFor="experiencepoints" className="charinfo-label" style={{ marginTop: '12px' }}>
          Experience Points
        </label>
        <input
          name="experiencepoints"
          placeholder=""
          className="charinfo-input"
          value={values.experiencepoints || ''}
          onChange={onChange}
        />
      </section>

      <section className="charinfo-grid">
        {fields.map(({ name, label, placeholder, type = 'text' }) => (
          <div key={name} className="charinfo-field">
            <label htmlFor={name} className="charinfo-label">
              {label}
            </label>
            <input
              name={name}
              placeholder={placeholder}
              className="charinfo-input"
              type={type}
              value={values[name] || ''}
              onChange={onChange}
            />
          </div>
        ))}
      </section>
    </header>
  );
};

export default CharacterHeader;
