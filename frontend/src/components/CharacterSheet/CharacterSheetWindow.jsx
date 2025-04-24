// CharacterSheetWindow.jsx

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import CharacterHeader from './CharacterHeader';
import AbilityScores from './AbilityScores';
import SkillsBlock from './SkillsBlock';
import ProficiencyInspirationBlock from './ProficiencyInspirationBlock';
import SavingThrowsOnlyBlock from './SavingThrowsOnlyBlock';
import CombatStats from './CombatStats';
import HitPointsBlock from './HitPointsBlock';
import DeathSaves from './DeathSaves';
import AttackSection from './AttackSection';
import PersonalityTraits from './PersonalityTraits';
import FeaturesAndTraits from './FeaturesAndTraits';
import CharacterPortrait from './CharacterPortrait';

const CharacterSheetWindow = ({ onClose, onSaveSuccess, character }) => {
  const newWindowRef = useRef(null);
  const containerRef = useRef(document.createElement('div'));
  const [portraitImage, setPortraitImage] = useState(character?.portraitImage || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const stats = {
      str: Number(data.get('strscore')),
      dex: Number(data.get('dexscore')),
      con: Number(data.get('conscore')),
      int: Number(data.get('intscore')),
      wis: Number(data.get('wisscore')),
      cha: Number(data.get('chascore')),
    };

    const attacks = [];
    let i = 0;
    while (data.has(`name-${i}`)) {
      const name = data.get(`name-${i}`);
      const atk = data.get(`atk-${i}`);
      const damage = data.get(`damage-${i}`);
      const type = data.get(`type-${i}`);
      if (name || atk || damage || type) {
        attacks.push({ name, atk, damage, type });
      }
      i++;
    }

    const skills = [];
    i = 0;
    while (data.has(`skill-name-${i}`)) {
      const name = data.get(`skill-name-${i}`);
      const stat = data.get(`skill-stat-${i}`);
      const mod = data.get(`skill-mod-${i}`);
      const proficient = data.get(`skill-prof-${i}`) === 'on';
      if (name) {
        skills.push({ name, stat, mod, proficient });
      }
      i++;
    }

    const savingThrows = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(attr => ({
      attr,
      value: data.get(`${attr}-save`),
      proficient: data.get(`${attr}-save-prof`) === 'on'
    }));

    const combatStats = {
      ac: data.get('ac'),
      initiative: data.get('initiative'),
      speed: data.get('speed')
    };

    const hitPoints = {
      max: data.get('maxhp'),
      current: data.get('currenthp'),
      temp: data.get('temphp')
    };

    const deathSaves = {
      successes: [0, 1, 2].map(i => data.get(`success-${i}`) === 'on'),
      failures: [0, 1, 2].map(i => data.get(`failure-${i}`) === 'on')
    };

    const traits = {
      personality: data.get('personalityTraits'),
      ideals: data.get('ideals'),
      bonds: data.get('bonds'),
      flaws: data.get('flaws')
    };

    const inspiration = data.get('inspiration');
    const proficiencyBonus = data.get('proficiencybonus');
    const backstory = data.get('features');

    const payload = {
      name: data.get('charname'),
      race: data.get('race'),
      class: data.get('class'),
      background: data.get('background'),
      level: Number(data.get('level')),
      stats,
      backstory,
      system: '5E',
      isPublic: false,
      attacks,
      skills,
      savingThrows,
      combatStats,
      hitPoints,
      deathSaves,
      traits,
      inspiration,
      proficiencyBonus,
      portraitImage
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save character');
      }
      alert('Character saved successfully!');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error(err);
      alert(`Error saving character: ${err.message}`);
    }
  };

  useEffect(() => {
    newWindowRef.current = window.open(
      '',
      'CharacterSheet',
      'width=1100,height=850,left=200,top=100,resizable,scrollbars=yes'
    );

    if (!newWindowRef.current) {
      console.warn('Popup blocked or failed to open.');
      onClose();
      return;
    }

    const newWin = newWindowRef.current;
    newWin.document.title = 'Character Sheet';
    newWin.document.body.style.margin = '0';
    newWin.document.body.style.backgroundColor = '#fdf6e3';
    newWin.document.body.appendChild(containerRef.current);

    const meta = newWin.document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    newWin.document.head.appendChild(meta);

    const styleLink = document.querySelector('link[rel="stylesheet"]');
    if (styleLink) {
      const clone = styleLink.cloneNode(true);
      newWin.document.head.appendChild(clone);
    }

    const localStyle = newWin.document.createElement('link');
    localStyle.rel = 'stylesheet';
    localStyle.href = `${window.location.origin}/character-sheet.css`;
    newWin.document.head.appendChild(localStyle);

    const root = ReactDOM.createRoot(containerRef.current);
    root.render(
      <form onSubmit={handleSubmit} className="p-4 min-h-screen bg-[#fdf6e3] font-sans">
        <div className="max-w-[1100px] mx-auto character-sheet-container">
          <div style={{ marginBottom: '1rem' }}>
            <CharacterPortrait imageSrc={portraitImage} setImageSrc={setPortraitImage} />
            <CharacterHeader character={character} />
          </div>

          <div className="character-columns">
            <div className="character-column">
              <div className="left-column-layout">
                <div className="left-tall-box">
                  <AbilityScores character={character} />
                </div>
                <div className="right-stacked-boxes">
                  <div className="stacked-box">
                    <ProficiencyInspirationBlock character={character} />
                  </div>
                  <div className="stacked-box">
                    <SavingThrowsOnlyBlock character={character} />
                  </div>
                  <div className="stacked-box">
                    <SkillsBlock character={character} />
                  </div>
                </div>
              </div>
            </div>

            <div className="character-column">
              <div className="middle-box" style={{ height: '15%', marginBottom: '8px' }}>
                <CombatStats character={character} />
              </div>
              <div className="middle-box" style={{ height: '20%', marginBottom: '8px' }}>
                <HitPointsBlock character={character} />
              </div>
              <div className="middle-box" style={{ height: '15%', marginBottom: '8px' }}>
                <DeathSaves character={character} />
              </div>
              <div className="middle-box" style={{ height: '44.5%' }}>
                <AttackSection character={character} />
              </div>
            </div>

            <div className="character-column">
              <div style={{ height: '50%', marginBottom: '12px', paddingTop: '12px' }}>
                <PersonalityTraits character={character} />
              </div>
              <div style={{ height: '50%' }}>
                <FeaturesAndTraits character={character} />
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
              Save Character
            </button>
          </div>
        </div>
      </form>
    );

    const timer = setInterval(() => {
      if (newWin.closed) {
        clearInterval(timer);
        onClose();
      }
    }, 500);

    return () => {
      clearInterval(timer);
      newWin.close();
    };
  }, [onClose, portraitImage]);

  return null;
};

export default CharacterSheetWindow;
