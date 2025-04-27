/**
 * Author: Brandon Trundle
 * File Name: SkillsBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders the skills management section of the character sheet, allowing users to add, edit,
 * and set proficiency for character skills.
 */

import { useEffect, useState } from 'react'; // React hooks for managing local component state and synchronizing with external data

/**
 * SkillsBlock Component
 * 
 * Purpose:
 * Manages and displays a list of character skills, including skill names, associated stats, modifiers, and proficiency checkboxes.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current list of skills.
 * @param {Function} onChange - Callback function to update the parent form when skills are modified.
 * 
 * Behavior:
 * - Loads existing skills from form values or defaults to a standard 5e skill list.
 * - Allows toggling proficiency, editing skill modifiers, names, and associated stats.
 * - Supports dynamically adding new custom skills.
 */
const SkillsBlock = ({ values, onChange }) => {
  const [skills, setSkills] = useState([]);
  
/**
 * Loads the character's skills from form values or defaults to a standard 5e skill list.
 * 
 * Behavior:
 * - If `values.skills` exists, sets it as the current skill list.
 * - Otherwise, initializes a default set of standard skills used in D&D 5e.
 * 
 * Dependencies:
 * - Runs whenever `values.skills` changes.
 */
  useEffect(() => {
    setSkills(values.skills || [
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
      { name: 'Survival', stat: 'Wis', mod: '', proficient: false },
    ]);
  }, [values.skills]);

/**
 * Updates a specific skill's field value when edited.
 * 
 * @param {number} index - Index of the skill in the skills array.
 * @param {string} field - Field name to update ('name', 'stat', 'mod', 'proficient').
 * @param {string|boolean} value - New value for the field.
 */
  const updateSkill = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
    onChange({ target: { name: 'skills', value: updated } });
  };

/**
 * Adds a new blank skill entry to the list.
 */
  const addSkill = () => {
    const updated = [...skills, { name: '', stat: '', mod: '', proficient: false }];
    setSkills(updated);
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
