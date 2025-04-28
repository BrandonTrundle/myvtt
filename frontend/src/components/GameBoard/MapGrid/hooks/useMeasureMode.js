// src/components/GameBoard/MapGrid/hooks/useMeasureMode.js

import { useCallback } from 'react';
import { SOCKET_EVENTS } from '../../../../constants/SOCKET_EVENTS';
import { useSocket } from '../../../../context/SocketContext';

export const useMeasureMode = ({ zoom, selectedToken, isMeasureMode, setMeasureTarget }) => {
  const { socket } = useSocket();

  const calculateDistance = useCallback((start, end) => {
    const gridSize = 64;
  
    const startCol = Math.floor((start.x + 32) / gridSize);
    const startRow = Math.floor((start.y + 32) / gridSize);
    const endCol = Math.floor((end.x) / gridSize);
    const endRow = Math.floor((end.y) / gridSize);
  
    console.log('[calculateDistance] startCol, startRow:', startCol, startRow);
    console.log('[calculateDistance] endCol, endRow:', endCol, endRow);
  
    const dx = Math.abs(endCol - startCol);
    const dy = Math.abs(endRow - startRow);
  
    console.log('[calculateDistance] dx:', dx, 'dy:', dy);
  
    const diagonalMoves = Math.min(dx, dy);
    const straightMoves = Math.abs(dx - dy);
  
    console.log('[calculateDistance] diagonalMoves:', diagonalMoves, 'straightMoves:', straightMoves);
  
    const distanceFeet = (diagonalMoves * 10) + (straightMoves * 5);
  
    console.log('[calculateDistance] distanceFeet:', distanceFeet);
  
    return distanceFeet;
  }, []);
  

  const handleMapClick = useCallback((e) => {
    // (Unused yet) 
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isMeasureMode || !selectedToken) {
      console.log('[handleMouseMove] Skipped: Measure mode off or no token selected.');
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;

    console.log('[handleMouseMove] Raw Mouse Coords:', { rawX, rawY });

    const gridSize = 64;
    const gridCol = Math.floor(rawX / gridSize);
    const gridRow = Math.floor(rawY / gridSize);

    console.log('[handleMouseMove] Grid Column/Row:', { gridCol, gridRow });


    const snappedX = gridCol * gridSize + gridSize / 2;
    const snappedY = gridRow * gridSize + gridSize / 2;

    console.log('[handleMouseMove] Snapped Target Coords:', { snappedX, snappedY });

    const target = { x: snappedX, y: snappedY };
    setMeasureTarget(target);

    if (socket && selectedToken) {
      console.log('[handleMouseMove] Emitting PLAYER_MEASURING:', {
        tokenId: selectedToken.id,
        from: { x: selectedToken.x, y: selectedToken.y },
        to: target,
      });

      socket.emit(SOCKET_EVENTS.PLAYER_MEASURING, {
        tokenId: selectedToken.id,
        from: { x: selectedToken.x, y: selectedToken.y },
        to: target,
      });
    }
  }, [isMeasureMode, selectedToken, zoom, setMeasureTarget, socket]);

  return {
    calculateDistance,
    handleMapClick,
    handleMouseMove,
  };
};
