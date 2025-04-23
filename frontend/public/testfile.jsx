// CharacterSheetWindow.jsx

import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import CharacterHeader from './CharacterHeader';

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
          <div style={{ border: '2px solid red', marginBottom: '1rem' }}>
            <CharacterHeader />
          </div>

          {/* Three-Column Layout */}
          <div className="character-columns">
            {/* Left Column */}
            <div className="character-column">
              <div className="left-column-layout">
                <div className="left-tall-box">Tall Box (75%)</div>
                {/* ATTRIBUTE SECTION */}
                <div className="right-stacked-boxes">
                  <div className="stacked-box">Box 1</div>
                  {/* PROFICIENCY AND INSPIRATION */}
                  <div className="stacked-box">Box 2</div>
                  {/* SAVING THROWS */}
                  <div className="stacked-box">Box 3</div>
                  {/* SKILLS */}
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="character-column">
              <div className="middle-box" style={{ border: '2px dashed orange', height: '15%', marginBottom: '8px' }}>Middle Box 1
                {/* AC - INITIATIVE - SPEED */}
              </div>
              <div className="middle-box" style={{ border: '2px dashed orange', height: '20%', marginBottom: '8px' }}>Middle Box 2
                {/* CURRENT HP - TEMP HP */}
              </div>
              <div className="middle-box" style={{ border: '2px dashed orange', height: '15%', marginBottom: '8px' }}>Middle Box 3
                {/* HIT DICE - DEATH SAVES */}
              </div>
              <div className="middle-box" style={{ border: '2px dashed orange', height: '44.5%' }}>Middle Box 4
                {/* ATTACKS */}
              </div>
            </div>

            {/* Right Column */}
            <div className="character-column">
              <div style={{ border: '2px dashed purple', height: '50%', marginBottom: '8px' }}>Right Box 1
                {/* PERSONALITY TRAITS - BONDS - FLAWS */}
              </div>
              <div style={{ border: '2px dashed purple', height: '50%' }}>Right Box 2
                {/* FEATURES AND TRAITS */}
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