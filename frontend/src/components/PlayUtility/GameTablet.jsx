import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DiceRoller from './DiceRoller';
import CharacterSelector from './CharacterSelector';
import CharacterSheetTab from './CharacterSheetTab';

const GameTablet = ({ handleRoll, selectedToken, isMeasureMode, setIsMeasureMode }) => {
  const [tabletWindow, setTabletWindow] = useState(null);
  const [container, setContainer] = useState(null);
  const [activeTab, setActiveTab] = useState('dice');

  const openTablet = () => {
    const newWindow = window.open(
      '/tablet.html',
      '',
      'width=500,height=700,left=200,top=200,resizable=yes,scrollbars=yes'
    );

    if (newWindow) {
      newWindow.onload = () => {
        const div = newWindow.document.getElementById('tablet-root');
        newWindow.document.title = 'ArcanaTable - Game Tablet';
        setTabletWindow(newWindow);
        setContainer(div);
      };
    }
  };

  const closeTablet = () => {
    if (tabletWindow) {
      tabletWindow.close();
      setTabletWindow(null);
      setContainer(null);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (tabletWindow) {
        tabletWindow.close();
      }
    };

    const checkPopoutClosed = () => {
      if (tabletWindow && tabletWindow.closed) {
        setTabletWindow(null);
        setContainer(null);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    const interval = setInterval(checkPopoutClosed, 500);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
      if (tabletWindow) {
        tabletWindow.close();
      }
    };
  }, [tabletWindow]);

  const TabletContent = (
    <div className="fade-in p-4 bg-parchment min-h-screen text-black">
      <h2 className="text-xl font-bold mb-4">🎮 Game Tablet</h2>

      <div className="flex gap-2 mb-4">
              <button
          onClick={() => setActiveTab('dice')}
          className={`px-2 py-1 border rounded ${activeTab === 'dice' ? 'active' : ''}`}
        >
          🎲 Dice
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`px-2 py-1 border rounded ${activeTab === 'characters' ? 'active' : ''}`}
        >
          🧙 Characters
        </button>
        <button
          onClick={() => setActiveTab('characterSheet')}
          className={`px-2 py-1 border rounded ${activeTab === 'characterSheet' ? 'active' : ''}`}
        >
          📜 Character Sheet
        </button>
        <button
          onClick={() => setActiveTab('tokenActions')}
          className={`px-2 py-1 border rounded ${activeTab === 'tokenActions' ? 'active' : ''}`}
        >
          🧭 Token Actions
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'dice' && <DiceRoller onRoll={handleRoll} />}
        {activeTab === 'characters' && <CharacterSelector />}
        {activeTab === 'characterSheet' && <CharacterSheetTab />}
        {activeTab === 'tokenActions' && (
          <div className="space-y-4">
            {selectedToken ? (
              <div className="space-y-2">
                <h3 className="text-lg font-bold">{selectedToken.name}</h3>
                <p>HP: {selectedToken.currentHp ?? '??'} / {selectedToken.maxHp ?? '??'}</p>

                <div className="flex gap-2">
                <button
                  className={`px-2 py-1 border rounded ${isMeasureMode ? 'action-active' : ''}`}
                  onClick={() => setIsMeasureMode((prev) => !prev)}
                >
                  📏 Measure
                </button>

                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => console.log('Attack Mode Activated')}
                >
                  ⚔️ Attack
                </button>

                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => console.log('Area Effect Mode Activated')}
                >
                  💥 AoE
                </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No token selected. Click a token to begin.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {!tabletWindow ? (
        <button
          onClick={openTablet}
          className="fixed top-4 right-4 z-50 bg-arcanared hover:bg-arcanabrown text-white px-4 py-2 rounded"
        >
          Open Tablet
        </button>
      ) : (
        <button
          onClick={closeTablet}
          className="fixed top-4 right-4 z-50 bg-arcanared hover:bg-arcanabrown text-white px-4 py-2 rounded"
        >
          Close Tablet
        </button>
      )}

      {container && ReactDOM.createPortal(TabletContent, container)}
    </>
  );
};

export default React.memo(GameTablet);
