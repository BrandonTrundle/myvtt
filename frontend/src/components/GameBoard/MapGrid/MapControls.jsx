// src/components/GameBoard/MapGrid/MapControls.jsx

import React from 'react';

const MapControls = ({ onZoomIn, onZoomOut, onToggleGrid, showGrid }) => {
  return (
    <div className="flex gap-4 items-center mb-2">
      <button onClick={onZoomOut} className="px-2 py-1 border rounded">
        Zoom Out
      </button>
      <button onClick={onZoomIn} className="px-2 py-1 border rounded">
        Zoom In
      </button>
      <button onClick={onToggleGrid} className="px-2 py-1 border rounded">
        {showGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
    </div>
  );
};

export default React.memo(MapControls);
