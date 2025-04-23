// SkillsBlock.jsx

import React, { useState } from 'react';

const defaultSkills = [
  { name: 'Acrobatics', stat: 'Dex' },
  { name: 'Animal Handling', stat: 'Wis' },
  { name: 'Arcana', stat: 'Int' },
  { name: 'Athletics', stat: 'Str' },
  { name: 'Deception', stat: 'Cha' },
  { name: 'History', stat: 'Int' },
  { name: 'Insight', stat: 'Wis' },
  { name: 'Intimidation', stat: 'Cha' },
  { name: 'Investigation', stat: 'Int' },
  { name: 'Medicine', stat: 'Wis' },
  { name: 'Nature', stat: 'Int' },
  { name: 'Perception', stat: 'Wis' },
  { name: 'Performance', stat: 'Cha' },
  { name: 'Persuasion', stat: 'Cha' },
  { name: 'Religion', stat: 'Int' },
  { name: 'Sleight of Hand', stat: 'Dex' },
  { name: 'Stealth', stat: 'Dex' },
  { name: 'Survival', stat: 'Wis' }
];

const SkillsBlock = () => {
  const [skills, setSkills] = useState(defaultSkills);

  const addSkill = () => {
    setSkills([...skills, { name: '', stat: '' }]);
  };

  return (
    <section className="skills-block">
      <div className="skills-title">Skills</div>
      <div className="skills-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill-row">
            <input type="checkbox" name={`skill-prof-${index}`} className="skill-checkbox" />
            <input type="text" name={`skill-mod-${index}`} placeholder="+0" className="skill-mod" />
            <input
              type="text"
              name={`skill-name-${index}`}
              placeholder="Skill"
              className="skill-name"
              defaultValue={skill.name}
            />
            <input
              type="text"
              name={`skill-stat-${index}`}
              placeholder="Stat"
              className="skill-stat"
              defaultValue={`(${skill.stat})`}
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
