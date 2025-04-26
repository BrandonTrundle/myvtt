import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS';

export const useMapSocket = (campaignId, onMapUrlChange, onSettingsChange) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !campaignId) return;

    const handleMapSettingsUpdated = (settings) => {
      onSettingsChange(settings);
    };

    const handleMapUpdated = (data) => {
      if (data?.activeMap) {
        onMapUrlChange(data.activeMap);
      } else {
        console.warn('⚠️ Received MAP_UPDATED without activeMap:', data);
      }
    };

    socket.on(SOCKET_EVENTS.MAP_SETTINGS_UPDATED, handleMapSettingsUpdated);
    socket.on(SOCKET_EVENTS.MAP_UPDATED, handleMapUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.MAP_SETTINGS_UPDATED, handleMapSettingsUpdated);
      socket.off(SOCKET_EVENTS.MAP_UPDATED, handleMapUpdated);
    };
  }, [socket, campaignId, onMapUrlChange, onSettingsChange]);
};
