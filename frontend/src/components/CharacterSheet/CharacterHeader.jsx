// CharacterHeader.jsx


const CharacterHeader = () => {
  const fields = [
    { name: 'class', label: 'Class', placeholder: 'Paladin' },
    { name: 'level', label: 'Level', placeholder: '2' },
    { name: 'background', label: 'Background', placeholder: 'Acolyte' },
    { name: 'playername', label: 'Player Name', placeholder: 'Player McPlayerface' },
    { name: 'race', label: 'Race', placeholder: 'Half-elf' },
    { name: 'alignment', label: 'Alignment', placeholder: 'Lawful Good' },
    
  ];

  return (
<header className="character-header">
  <section className="charname-section">
    <label htmlFor="charname" className="charname-label">
      Character Name
    </label>
    <input
      name="charname"
      placeholder="Thoradin Fireforge"
      className="charname-input"
    />

    <label htmlFor="experiencepoints" className="charinfo-label" style={{ marginTop: '12px' }}>
      Experience Points
    </label>
    <input
      name="experiencepoints"
      placeholder="3240"
      className="charinfo-input"
    />
  </section>

      <section className="charinfo-grid">
        {fields.map(field => (
          <div key={field.name} className="charinfo-field">
            <label htmlFor={field.name} className="charinfo-label">
              {field.label}
            </label>
            <input
              name={field.name}
              placeholder={field.placeholder}
              className="charinfo-input"
            />
          </div>
        ))}
      </section>
    </header>
  );
};

export default CharacterHeader;