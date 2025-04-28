/**
 * Author: Brandon Trundle
 * File Name: useMapSocket.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook to manage live map updates and settings changes via WebSocket events.
 * 
 * Behavior:
 * - Subscribes to MAP_UPDATED and MAP_SETTINGS_UPDATED events.
 * - Updates the active map URL and settings state accordingly.
 * - Cleans up socket event listeners on unmount or dependency change.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect } from 'react'; // React hook for managing side effects
import { useSocket } from '../../../context/SocketContext'; // Custom hook for accessing the WebSocket connection
import { SOCKET_EVENTS } from '../../../constants/SOCKET_EVENTS'; // Centralized WebSocket event name constants

/**
 * useMapSocket Hook
 * 
 * Listens for map updates and map settings changes over the WebSocket connection.
 * 
 * @param {string} campaignId - ID of the current campaign
 * @param {Function} onMapUrlChange - Callback to update the map URL on new map upload
 * @param {Function} onSettingsChange - Callback to update map settings (e.g., zoom, grid visibility)
 * @returns {void}
 */
export const useMapSocket = (campaignId, onMapUrlChange, onSettingsChange) => {
  const { socket } = useSocket();
  
/**
 * Subscribes to MAP_UPDATED and MAP_SETTINGS_UPDATED socket events.
 * 
 * Behavior:
 * - Updates map URL when a new map is uploaded.
 * - Updates map settings when GM changes zoom or grid visibility.
 * - Cleans up event listeners on unmount or when dependencies change.
 */
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
