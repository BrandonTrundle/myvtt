// components/CharacterSheet/CharacterSheetForm.jsx

import { useState, useEffect } from 'react';
import CharacterHeader from './StatBlocks/CharacterHeader';
import AbilityScores from './StatBlocks/AbilityScores';
import SkillsBlock from './StatBlocks/SkillsBlock';
import ProficiencyInspirationBlock from './StatBlocks/ProficiencyInspirationBlock';
import SavingThrowsOnlyBlock from './StatBlocks/SavingThrowsOnlyBlock';
import CombatStats from './StatBlocks/CombatStats';
import HitPointsBlock from './StatBlocks/HitPointsBlock';
import DeathSaves from './StatBlocks/DeathSaves';
import AttackSection from './StatBlocks/AttackSection';
import PersonalityTraits from './StatBlocks/PersonalityTraits';
import FeaturesAndTraits from './StatBlocks/FeaturesAndTraits';
import CharacterPortrait from './StatBlocks/CharacterPortrait';
import WisdomAndProficiencies from './StatBlocks/WisdomAndProficiencies';
import EquipmentSection from './StatBlocks/EquipmentSection';
import PhysicalAttributesBlock from './StatBlocks/PhysicalAttributes';
import CharacterAppearance from './StatBlocks/CharacterAppearance';
import AlliesAndOrganizations from './StatBlocks/AlliesAndOrganizations';
import SpellCastingInfoBlock from './StatBlocks/SpellCastingInfoBlock';
import SpellCastingSection from './StatBlocks/SpellCastingSection';
import TreasureBlock from './StatBlocks/TreasureBlock';


const CharacterSheetForm = ({ onSubmit, character }) => {
  const [portraitImage, setPortraitImage] = useState(character?.portraitImage || null);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState(() => {
    // Merge flat values from character (if any), excluding arrays and nested objects
    const safeCharacter = character || {};
    const flattened = {};
  
    Object.entries(safeCharacter).forEach(([key, val]) => {
      if (
        val === null ||
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean'
      ) {
        flattened[key] = val;
      }
    });
  
    const base = flattened;

    // Add array-based defaults if character exists
    if (safeCharacter.skills) base.skills = safeCharacter.skills;
    if (safeCharacter.attacks) base.attacks = safeCharacter.attacks;
    if (safeCharacter.equipment) base.equipment = safeCharacter.equipment;
    if (safeCharacter.treasure) base.treasure = safeCharacter.treasure;
    if (safeCharacter.coins) base.coins = safeCharacter.coins;
    if (safeCharacter.spells) base.spells = safeCharacter.spells;

    return base;
  });

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
