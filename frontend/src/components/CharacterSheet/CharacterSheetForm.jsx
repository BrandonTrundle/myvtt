/**
 * Author: Brandon Trundle
 * File Name: CharacterSheetForm.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders a complete multi-page editable character sheet form for ArcanaTable.
 * Handles updating character fields across multiple tabs, uploading a character portrait,
 * and organizing character sheet sections into reusable stat block components.
 * 
 * Props:
 * - onSubmit (function): Callback function to handle form submission.
 * - character (object): Optional initial character data to populate the form.
 */

import { useState, useEffect } from 'react'; // React hooks for state and side-effects
import CharacterHeader from './StatBlocks/CharacterHeader'; // Header block (Character name, etc.)
import AbilityScores from './StatBlocks/AbilityScores'; // Ability scores block
import SkillsBlock from './StatBlocks/SkillsBlock'; // Skills block
import ProficiencyInspirationBlock from './StatBlocks/ProficiencyInspirationBlock'; // Proficiency and inspiration block
import SavingThrowsOnlyBlock from './StatBlocks/SavingThrowsOnlyBlock'; // Saving throws block
import CombatStats from './StatBlocks/CombatStats'; // Combat stats block
import HitPointsBlock from './StatBlocks/HitPointsBlock'; // Hit points block
import DeathSaves from './StatBlocks/DeathSaves'; // Death saves block
import AttackSection from './StatBlocks/AttackSection'; // Attack actions block
import PersonalityTraits from './StatBlocks/PersonalityTraits'; // Personality traits block
import FeaturesAndTraits from './StatBlocks/FeaturesAndTraits'; // Features and traits block
import CharacterPortrait from './StatBlocks/CharacterPortrait'; // Character portrait uploader
import WisdomAndProficiencies from './StatBlocks/WisdomAndProficiencies'; // Passive wisdom and proficiencies
import EquipmentSection from './StatBlocks/EquipmentSection'; // Equipment section
import PhysicalAttributesBlock from './StatBlocks/PhysicalAttributes'; // Physical attributes (age, height, etc.)
import CharacterAppearance from './StatBlocks/CharacterAppearance'; // Character appearance section
import AlliesAndOrganizations from './StatBlocks/AlliesAndOrganizations'; // Allies and organizations block
import SpellCastingInfoBlock from './StatBlocks/SpellCastingInfoBlock'; // Spellcasting meta info block
import SpellCastingSection from './StatBlocks/SpellCastingSection'; // Full spell list and slots section
import TreasureBlock from './StatBlocks/TreasureBlock'; // Treasure and coins block

/**
 * CharacterSheetForm Component
 * 
 * Displays and manages a multi-page character sheet form, divided into three tabbed pages:
 *  - Page 1: Core character stats, combat, and personality
 *  - Page 2: Physical attributes, organizations, and treasure
 *  - Page 3: Spellcasting information and spell lists
 * 
 * Handles:
 * - Form field updates across nested components
 * - Portrait image uploads
 * - Multi-page tab navigation
 * - Submitting final character form data
 * 
 * @param {Function} onSubmit - Callback invoked when form is submitted.
 * @param {Object} character - Initial character data object to populate the form.
 */
const CharacterSheetForm = ({ onSubmit, character }) => {
  
  // Local state for managing uploaded portrait image
  const [portraitImage, setPortraitImage] = useState(character?.portraitImage || null);
  
  // Local state for managing current tab/page
  const [currentPage, setCurrentPage] = useState(1);
  
  // Local state for form data reflecting the character sheet fields
  const [formData, setFormData] = useState(() => {
    const safeCharacter = character || {};
    const base = {};
  
    // Flatten primitives
    Object.entries(safeCharacter).forEach(([key, val]) => {
      if (
        val === null ||
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean'
      ) {
        base[key] = val;
      }
    });
  
    // Preserve known arrays and objects
    if (safeCharacter.skills) base.skills = safeCharacter.skills;
    if (safeCharacter.attacks) base.attacks = safeCharacter.attacks;
    if (safeCharacter.equipment) base.equipment = safeCharacter.equipment;
    if (safeCharacter.treasure) base.treasure = safeCharacter.treasure;
    if (safeCharacter.coins) base.coins = safeCharacter.coins;
    if (safeCharacter.spells) base.spells = safeCharacter.spells;
    if (!base.allies) base.allies = '';
    if (!base.orgName) base.orgName = '';
    if (!base.orgSymbolImage) base.orgSymbolImage = '';
  
    return base;
  });
  
/**
 * Effect to initialize or update form data whenever the provided character prop changes.
 */
  useEffect(() => {
    if (character) {
      setFormData({
        ...character,
        portraitImage: character.portraitImage || null,
        coins: character.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
        treasure: character.treasure || [],
        skills: character.skills || [],
        attacks: character.attacks || [],
        equipment: character.equipment || [],
      });
    }
  }, [character]);

/**
 * Generic handler for updating form field values.
 * Supports checkboxes and text inputs dynamically.
 */  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  return (
<form
  onSubmit={(e) => {
    console.log("🧪 Submitting formData:", formData);
    onSubmit(e, portraitImage, formData);
  }}
  className="p-4 min-h-screen bg-[#fdf6e3] font-sans"
>
  <div className="tabs flex gap-2 mb-4">
    {[1, 2, 3].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => setCurrentPage(n)}
        className={`px-4 py-2 rounded ${currentPage === n ? 'bg-arcanared text-white' : 'bg-gray-200'}`}
      >
        Page {n}
      </button>
    ))}
  </div>

      {currentPage === 1 && (
        <div className="max-w-[1100px] mx-auto character-sheet-container">
          <div style={{ marginBottom: '1rem' }}>
            <CharacterPortrait imageSrc={portraitImage} setImageSrc={setPortraitImage} />
            <CharacterHeader character={character} onChange={handleChange} values={formData} />
          </div>

          <div className="character-columns">
            <div className="character-column">
              <div className="left-column-layout">
                <div className="left-tall-box">
                  <AbilityScores character={character} onChange={handleChange} values={formData} />
                </div>
                <div className="right-stacked-boxes">
                  <div className="stacked-box">
                    <ProficiencyInspirationBlock character={character} onChange={handleChange} values={formData} />
                  </div>
                  <div className="stacked-box">
                    <SavingThrowsOnlyBlock character={character} onChange={handleChange} values={formData} />
                  </div>
                  <div className="stacked-box">
                    <SkillsBlock character={character} onChange={handleChange} values={formData} />
                  </div>
                </div>
              </div>
            </div>

            <div className="character-column">
              <div className="middle-box" style={{ height: '15%', marginBottom: '8px' }}>
                <CombatStats character={character} onChange={handleChange} values={formData} />
              </div>
              <div className="middle-box" style={{ height: '20%', marginBottom: '8px' }}>
                <HitPointsBlock character={character} onChange={handleChange} values={formData} />
              </div>
              <div className="middle-box" style={{ height: '15%', marginBottom: '8px' }}>
                <DeathSaves character={character} onChange={handleChange} values={formData} />
              </div>
              <div className="middle-box" style={{ height: '44.5%' }}>
                <AttackSection character={character} onChange={handleChange} values={formData} />
              </div>
            </div>

            <div className="character-column">
              <div style={{ height: '50%', marginBottom: '12px', paddingTop: '12px' }}>
                <PersonalityTraits character={character} onChange={handleChange} values={formData} />
              </div>
              <div style={{ height: '50%' }}>
                <FeaturesAndTraits character={character} onChange={handleChange} values={formData} />
              </div>
            </div>
          </div>

          <div className="other-features-section">
            <WisdomAndProficiencies onChange={handleChange} values={formData} />
          </div>

          <div>
            <EquipmentSection onChange={handleChange} values={formData} />
          </div>

          <div className="mt-6 text-center">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
              Save Character
            </button>
          </div>
        </div>
      )}

      {currentPage === 2 && (
        <div className="max-w-[1100px] mx-auto character-sheet-container">
          <div className="tab2-container">
            <div className="tab2-top">
              <PhysicalAttributesBlock onChange={handleChange} values={formData} />
            </div>
            <div className="tab2-middle">
              <div className="tab2-middle-left">
                <CharacterAppearance onChange={handleChange} values={formData} />
              </div>
              <div className="tab2-middle-right">
                <AlliesAndOrganizations onChange={handleChange} values={formData} />
              </div>
            </div>
            <div className="tab2-bottom">
              <div className="tab2-bottom-left">
              <TreasureBlock values={formData} onChange={handleChange} />
              </div>
              <div className="tab2-bottom-right">
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 3 && (
        <div className="max-w-[1100px] mx-auto character-sheet-container">
          <div className="tab3-container">
            <div className="tab3-top">
              <SpellCastingInfoBlock onChange={handleChange} values={formData} />
            </div>
            <div className="tab3-body">
              <SpellCastingSection onChange={handleChange} values={formData} />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CharacterSheetForm;
