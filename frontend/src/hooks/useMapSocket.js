// 📂 frontend/hooks/useMapSocket.js
import { useEffect } from 'react';
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS';
import { useSocket } from '../context/SocketContext';

export function useMapSocket(campaignId, onMapUploaded, onMapSettings) {
  const { socket, isConnected, joinCampaign } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !campaignId) return;

    joinCampaign(campaignId);

    socket.on(SOCKET_EVENTS.MAP_UPLOADED, ({ imageUrl }) => {
      if (onMapUploaded) onMapUploaded(imageUrl);
    });

    socket.on(SOCKET_EVENTS.MAP_SETTINGS_UPDATED, ({ zoom, showGrid }) => {
      if (onMapSettings) onMapSettings({ zoom, showGrid });
    });

    return () => {
      socket.off(SOCKET_EVENTS.MAP_UPLOADED);
      socket.off(SOCKET_EVENTS.MAP_SETTINGS_UPDATED);
    };
  }, [socket, isConnected, campaignId, onMapUploaded, onMapSettings]);
}
