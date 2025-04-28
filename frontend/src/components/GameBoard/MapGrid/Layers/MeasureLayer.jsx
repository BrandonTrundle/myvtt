// src/components/GameBoard/MapGrid/MeasureLayer.jsx

import React from 'react';

const gridSize = 64; // You could eventually import this from constants.js

const MeasureLayer = ({
  zoom,
  mapTileWidth,
  mapTileHeight,
  selectedToken,
  measureTarget,
  otherPlayersMeasurements,
  calculateDistance,
}) => {
  const mapWidth = gridSize * mapTileWidth;
  const mapHeight = gridSize * mapTileHeight;

  return (
    <svg
      className="absolute top-0 left-0"
      style={{
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
        pointerEvents: "none",
      }}
    >
      {/* Other players' measurements */}
      {Object.entries(otherPlayersMeasurements).map(([tokenId, { from, to }]) => {
        const startX = Math.floor(from.x / gridSize) * gridSize + gridSize / 2;
        const startY = Math.floor(from.y / gridSize) * gridSize + gridSize / 2;
        const endX = Math.floor(to.x / gridSize) * gridSize + gridSize / 2;
        const endY = Math.floor(to.y / gridSize) * gridSize + gridSize / 2;

        return (
          <g key={tokenId}>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="magenta"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2}
              fill="magenta"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              {calculateDistance(from, to)} ft
            </text>
          </g>
        );
      })}

      {/* Your own measurement */}
      {selectedToken && measureTarget && (() => {
        const startX = Math.floor(selectedToken.x / gridSize) * gridSize + gridSize / 2;
        const startY = Math.floor(selectedToken.y / gridSize) * gridSize + gridSize / 2;
        const endX = measureTarget.x;
        const endY = measureTarget.y;

        return (
          <>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="cyan"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            <text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2}
              fill="white"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              {calculateDistance(selectedToken, measureTarget)} ft
            </text>
          </>
        );
      })()}

      {/* Arrowhead marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="cyan" />
        </marker>
      </defs>
    </svg>
  );
};

export default React.memo(MeasureLayer);
