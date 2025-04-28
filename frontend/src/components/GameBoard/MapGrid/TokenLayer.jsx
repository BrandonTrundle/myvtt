// src/components/GameBoard/MapGrid/TokenLayer.jsx

import React from 'react';

const TokenLayer = ({
  tokens,
  selectedToken,
  userId,
  isGM,
  zoom,
  onTokenClick,
  onTokenDragStart,
  onTokenDragEnd,
}) => {
  const getHealthRingColor = (token) => {
    if (token.maxHp && token.currentHp !== undefined) {
      const percent = (token.currentHp / token.maxHp) * 100;
      if (percent > 66) return 'green';
      if (percent > 33) return 'yellow';
      return 'red';
    }
    return 'gray';
  };

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        pointerEvents: 'none', // Important: so base map can still be dragged/dropped
      }}
    >
      {tokens.map((token) => {
        const isSelected = selectedToken && selectedToken.id === token.id;
        const healthRingColor = getHealthRingColor(token);

        const canDrag = userId && (token.ownerIds.includes(userId) || isGM);

        return (
          <div
            key={token.id + token.x + token.y}
            onClick={() => canDrag && onTokenClick(token)}
            draggable={canDrag}
            onDragStart={(e) => canDrag && onTokenDragStart(e, token)}
            onDragEnd={(e) => canDrag && onTokenDragEnd(e, token)}
            className="absolute"
            style={{
              left: `${token.x}px`,
              top: `${token.y}px`,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: `3px solid ${healthRingColor}`,
              boxShadow: isSelected ? '0 0 10px 3px white' : 'none',
              cursor: canDrag ? 'pointer' : 'default',
              overflow: 'hidden',
              pointerEvents: 'auto', // Enable clicks/drags on tokens
            }}
          >
            <img
              src={token.portrait}
              alt={token.name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                pointerEvents: 'none', // Clicking image doesn't block dragging
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(TokenLayer);
