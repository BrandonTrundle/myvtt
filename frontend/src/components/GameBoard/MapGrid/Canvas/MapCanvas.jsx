import React from 'react';

const MapCanvas = ({ mapUrl, zoom, showGrid }) => {
  return (
    <div className="relative overflow-auto border rounded shadow max-w-full">
      <div
        className="relative inline-block"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          cursor: 'crosshair',
        }}
      >
        {mapUrl ? (
          <img
            src={mapUrl}
            alt="Campaign Map"
            className="block max-w-none"
            draggable={false} // prevent default drag behavior
          />
        ) : (
          <p className="text-gray-500 p-4">
            Campaign Map will appear here.
          </p>
        )}

        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(MapCanvas);
