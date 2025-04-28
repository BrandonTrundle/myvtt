// src/hooks/useTokenDragDrop.js
import { useCallback } from 'react';
import { SOCKET_EVENTS } from '../../../../constants/SOCKET_EVENTS';

export const useTokenDragDrop = ({ zoom, setTokens, socket, user, isGM, isMeasureMode, selectedToken, setIsMeasureMode, setMeasureTarget, setSelectedToken, campaignId }) => {
  const gridSize = 64;
  const tokenSize = 48;
  const offset = (gridSize - tokenSize) / 2;

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const { id, name, portrait } = JSON.parse(data);
      const rect = e.currentTarget.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) / zoom;
      const rawY = (e.clientY - rect.top) / zoom;

      const newX = Math.round(rawX / gridSize) * gridSize + offset;
      const newY = Math.round(rawY / gridSize) * gridSize + offset;

      const newToken = {
        id,
        name,
        portrait,
        x: newX,
        y: newY,
        type: 'player',
        campaignId: campaignId, // Fill this manually if needed
        ownerIds: [user._id],
        createdBy: user._id,
        currentHp: 100,
        maxHp: 100,
      };

      setTokens((prevTokens) => {
        const exists = prevTokens.some(t => t.id === newToken.id && t.type === 'player');
        if (exists) {
          return prevTokens.map(t =>
            t.id === newToken.id && t.type === 'player' ? { ...t, x: newToken.x, y: newToken.y } : t
          );
        } else {
          return [...prevTokens, newToken];
        }
      });

      socket?.emit(SOCKET_EVENTS.TOKEN_SPAWNED, newToken);
    } catch (err) {
      console.error('Invalid drop data', err);
    }
  }, [zoom, setTokens, socket, user]);

  const handleTokenDragStart = useCallback((e, token) => {
    e.dataTransfer.setData('application/json', JSON.stringify(token));
  }, []);

  const handleTokenDragEnd = useCallback((e, token) => {
    const rect = e.currentTarget.parentNode.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;
  
    const newX = Math.round(rawX / gridSize) * gridSize + offset;
    const newY = Math.round(rawY / gridSize) * gridSize + offset;
  
    const updatedToken = { ...token, x: newX, y: newY };
  
    setTokens((prevTokens) =>
      prevTokens.map(t =>
        t.id === updatedToken.id && t.createdBy === updatedToken.createdBy ? updatedToken : t
      )
    );
  
    if (socket && updatedToken?.campaignId) {
      socket.emit('token_moved', {
        campaignId: updatedToken.campaignId,
        token: updatedToken,
      });
    }
  
    if (isMeasureMode && selectedToken?.id === updatedToken.id) {
      setIsMeasureMode(false);
      setMeasureTarget(null);
      setSelectedToken(updatedToken);
    }
  }, [zoom, setTokens, socket, isMeasureMode, selectedToken, setIsMeasureMode, setMeasureTarget, setSelectedToken]);
  

  return {
    handleDragOver,
    handleDrop,
    handleTokenDragStart,
    handleTokenDragEnd,
  };
};
