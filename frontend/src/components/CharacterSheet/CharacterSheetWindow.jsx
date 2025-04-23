// CharacterSheetWindow.jsx

import { useEffect, useRef } from 'react';
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


const CharacterSheetWindow = ({ onClose }) => {
  const newWindowRef = useRef(null);
  const containerRef = useRef(document.createElement('div'));

  useEffect(() => {
    newWindowRef.current = window.open(
      '',
      'CharacterSheet',
      'width=1100,height=850,left=200,top=100,resizable,scrollbars=yes'
    );

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
      <div className="p-4 min-h-screen bg-[#fdf6e3] font-sans">
        <div className="max-w-[1100px] mx-auto character-sheet-container">
          {/* Header Row */}
          <div style={{  marginBottom: '1rem' }}>
            <CharacterHeader />
          </div>

          {/* Three-Column Layout */}
          <div className="character-columns">
            {/* Left Column */}
            <div className="character-column">
              <div className="left-column-layout">
                <div className="left-tall-box">
                  {/* ATTRIBUTE SECTION */}
                  <AbilityScores />
                </div>
                <div className="right-stacked-boxes">
                  <div className="stacked-box">
                    <ProficiencyInspirationBlock />
                  </div>
                  {/* PROFICIENCY AND INSPIRATION */}
                  <div className="stacked-box">
                    <SavingThrowsOnlyBlock />
                  </div>
                  {/* SAVING THROWS */}
                  <div className="stacked-box">
                    {/* SKILLS */}
                    <SkillsBlock />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="character-column">
              <div className="middle-box" style={{  height: '15%', marginBottom: '8px', }}>
                <CombatStats />
              </div>
              <div className="middle-box" style={{  height: '20%', marginBottom: '8px' }}>
                {/* CURRENT HP - TEMP HP */}
                <HitPointsBlock />
              </div>
              <div className="middle-box" style={{  height: '15%', marginBottom: '8px' }}>
                {/* HIT DICE - DEATH SAVES */}
                <DeathSaves />
              </div>
              <div className="middle-box" style={{  height: '44.5%' }}>
                {/* ATTACKS */}
                <AttackSection />
              </div>
            </div>

            {/* Right Column */}
            <div className="character-column">
            <div style={{  height: '50%', marginBottom: '12px', paddingTop: '12px' }}>
                {/* PERSONALITY TRAITS - IDEALS - BONDS - FLAWS */}
                <PersonalityTraits />
              </div>
              <div style={{  height: '50%' }}>
                {/* FEATURES AND TRAITS */}
                <FeaturesAndTraits />
              </div>
            </div>
          </div>
        </div>
      </div>
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
  }, [onClose]);

  return null;
};

export default CharacterSheetWindow;