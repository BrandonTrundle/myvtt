// src/components/GameBoard/MapGrid/hooks/useMeasureMode.js

import { useCallback } from 'react';
import { SOCKET_EVENTS } from '../../../../constants/SOCKET_EVENTS';
import { useSocket } from '../../../../context/SocketContext';

export const useMeasureMode = ({ zoom, selectedToken, isMeasureMode, setMeasureTarget, campaignId }) => {
  const { socket } = useSocket();

  const calculateDistance = useCallback((start, end) => {
    const gridSize = 64;
    const startCol = Math.floor((start.x + 32) / gridSize);
    const startRow = Math.floor((start.y + 32) / gridSize);
    const endCol = Math.floor((end.x) / gridSize);
    const endRow = Math.floor((end.y) / gridSize);

    const dx = Math.abs(endCol - startCol);
    const dy = Math.abs(endRow - startRow);

    const diagonalMoves = Math.min(dx, dy);
    const straightMoves = Math.abs(dx - dy);

    const distanceFeet = (diagonalMoves * 10) + (straightMoves * 5);
    return distanceFeet;
  }, []);

  const handleMapClick = useCallback((e) => {
    // (Unused yet)
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isMeasureMode || !selectedToken) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;

    const gridSize = 64;
    const gridCol = Math.floor(rawX / gridSize);
    const gridRow = Math.floor(rawY / gridSize);

    const snappedX = gridCol * gridSize + gridSize / 2;
    const snappedY = gridRow * gridSize + gridSize / 2;

    const target = { x: snappedX, y: snappedY };
    setMeasureTarget(target);

    if (socket && selectedToken && campaignId) {
      socket.emit(SOCKET_EVENTS.PLAYER_MEASURING, {
        campaignId,
        tokenId: selectedToken.id,
        from: { x: selectedToken.x, y: selectedToken.y },
        to: target,
      });
    }
  }, [isMeasureMode, selectedToken, zoom, setMeasureTarget, socket, campaignId]);

  const handleMouseLeave = useCallback(() => {
    if (!isMeasureMode || !selectedToken) return;

    if (socket && campaignId) {
      socket.emit(SOCKET_EVENTS.PLAYER_MEASURING, {
        campaignId,
        tokenId: selectedToken.id,
        from: null,
        to: null,
      });
    }
  }, [isMeasureMode, selectedToken, socket, campaignId]);

  return {
    calculateDistance,
    handleMapClick,
    handleMouseMove,
    handleMouseLeave,
  };
};