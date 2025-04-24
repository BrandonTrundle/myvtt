const SkillsBlock = ({ values, onChange }) => {
  const skills = values.skills || [
    { name: 'Acrobatics', stat: 'Dex', mod: '', proficient: false },
    { name: 'Animal Handling', stat: 'Wis', mod: '', proficient: false },
    { name: 'Arcana', stat: 'Int', mod: '', proficient: false },
    { name: 'Athletics', stat: 'Str', mod: '', proficient: false },
    { name: 'Deception', stat: 'Cha', mod: '', proficient: false },
    { name: 'History', stat: 'Int', mod: '', proficient: false },
    { name: 'Insight', stat: 'Wis', mod: '', proficient: false },
    { name: 'Intimidation', stat: 'Cha', mod: '', proficient: false },
    { name: 'Investigation', stat: 'Int', mod: '', proficient: false },
    { name: 'Medicine', stat: 'Wis', mod: '', proficient: false },
    { name: 'Nature', stat: 'Int', mod: '', proficient: false },
    { name: 'Perception', stat: 'Wis', mod: '', proficient: false },
    { name: 'Performance', stat: 'Cha', mod: '', proficient: false },
    { name: 'Persuasion', stat: 'Cha', mod: '', proficient: false },
    { name: 'Religion', stat: 'Int', mod: '', proficient: false },
    { name: 'Sleight of Hand', stat: 'Dex', mod: '', proficient: false },
    { name: 'Stealth', stat: 'Dex', mod: '', proficient: false },
    { name: 'Survival', stat: 'Wis', mod: '', proficient: false }
  ];

  const updateSkill = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    onChange({ target: { name: 'skills', value: updated } });
  };

  const addSkill = () => {
    const updated = [...skills, { name: '', stat: '', mod: '', proficient: false }];
    onChange({ target: { name: 'skills', value: updated } });
  };

  return (
    <section className="skills-block">
      <div className="skills-title">Skills</div>
      <div className="skills-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill-row">
            <input
              type="checkbox"
              className="skill-checkbox"
              checked={skill.proficient || false}
              onChange={(e) => updateSkill(index, 'proficient', e.target.checked)}
            />
            <input
              type="text"
              placeholder="+0"
              className="skill-mod"
              value={skill.mod}
              onChange={(e) => updateSkill(index, 'mod', e.target.value)}
            />
            <input
              type="text"
              placeholder="Skill"
              className="skill-name"
              value={skill.name}
              onChange={(e) => updateSkill(index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Stat"
              className="skill-stat"
              value={skill.stat}
              onChange={(e) => updateSkill(index, 'stat', e.target.value)}
            />
          </div>
        ))}
      </div>
      <button type="button" className="add-skill-btn" onClick={addSkill}>
        + Add Skill
      </button>
    </section>
  );
};

export default SkillsBlock;
