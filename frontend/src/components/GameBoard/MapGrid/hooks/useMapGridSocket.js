// src/components/GameBoard/MapGrid/useMapGridSocket.js

import { useEffect } from 'react';
import { SOCKET_EVENTS } from '../../../../constants/SOCKET_EVENTS';

export const useMapGridSocket = ({ socket, setTokens }) => {
  useEffect(() => {
    if (!socket) return;

    const handleTokenSpawned = (token) => {
      setTokens((prevTokens) => {
        const exists = prevTokens.some(t => t.id === token.id && t.type === token.type);
        if (exists) {
          return prevTokens.map(t =>
            t.id === token.id && t.type === token.type ? { ...t, x: token.x, y: token.y } : t
          );
        } else {
          return [...prevTokens, token];
        }
      });
    };

    const handleTokenMoved = (token) => {
      setTokens((prevTokens) =>
        prevTokens.map(t =>
          t.id === token.id && t.type === token.type ? { ...t, x: token.x, y: token.y } : t
        )
      );
    };

    socket.on(SOCKET_EVENTS.TOKEN_SPAWNED, handleTokenSpawned);
    socket.on('token_moved', handleTokenMoved);

    return () => {
      socket.off(SOCKET_EVENTS.TOKEN_SPAWNED, handleTokenSpawned);
      socket.off('token_moved', handleTokenMoved);
    };
  }, [socket, setTokens]);
};
