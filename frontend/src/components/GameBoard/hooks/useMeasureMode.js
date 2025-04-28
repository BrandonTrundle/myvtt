// src/components/GameBoard/MapGrid/hooks/useMeasureMode.js

import { useCallback } from 'react';
import { SOCKET_EVENTS } from '../../../constants/SOCKET_EVENTS';
import { useSocket } from '../../../context/SocketContext';

export const useMeasureMode = ({ zoom, selectedToken, isMeasureMode, setMeasureTarget, campaignId }) => {
  const { socket } = useSocket();
  const gridSize = 64; // size of one grid square in pixels

  const snapToCenter = (pos) => {
    const gridCol = Math.floor(pos.x / gridSize);
    const gridRow = Math.floor(pos.y / gridSize);
    return {
      x: gridCol * gridSize + gridSize / 2,
      y: gridRow * gridSize + gridSize / 2,
    };
  };

  const calculateDistance = useCallback((start, end) => {
    const startSnapped = snapToCenter(start);
    const endSnapped = snapToCenter(end);

    const dx = Math.abs(endSnapped.x - startSnapped.x);
    const dy = Math.abs(endSnapped.y - startSnapped.y);

    const squaresX = Math.floor(dx / gridSize);
    const squaresY = Math.floor(dy / gridSize);

    const diagonalMoves = Math.min(squaresX, squaresY);
    const straightMoves = Math.abs(squaresX - squaresY);

    const distanceFeet = (diagonalMoves * 10) + (straightMoves * 5);
    return distanceFeet;
  }, []);

  const handleMapClick = useCallback((e) => {
    // (Unused for now)
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isMeasureMode || !selectedToken) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;

    const target = snapToCenter({ x: rawX, y: rawY });
    const origin = snapToCenter({ x: selectedToken.x, y: selectedToken.y });

    setMeasureTarget(target);

    if (socket && campaignId) {
      socket.emit(SOCKET_EVENTS.PLAYER_MEASURING, {
        campaignId,
        tokenId: selectedToken.id,
        from: origin,
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