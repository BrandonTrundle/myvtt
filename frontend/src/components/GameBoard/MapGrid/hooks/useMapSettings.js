// src/hooks/useMapSettings.js
import { useState, useCallback } from 'react';
import { SOCKET_EVENTS } from '../../../../constants/SOCKET_EVENTS';

export const useMapSettings = ({ socket, isGM }) => {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const broadcastSettings = useCallback((newSettings) => {
    if (socket && isGM) {
      socket.emit(SOCKET_EVENTS.MAP_SETTINGS_UPDATED, {
        zoom,
        showGrid,
        ...newSettings,
      });
    }
  }, [socket, isGM, zoom, showGrid]);

  const handleZoomChange = useCallback((delta) => {
    const newZoom = Math.min(3, Math.max(0.5, zoom + delta));
    setZoom(newZoom);
    broadcastSettings({ zoom: newZoom });
  }, [zoom, broadcastSettings]);

  const toggleGrid = useCallback(() => {
    const newGridState = !showGrid;
    setShowGrid(newGridState);
    broadcastSettings({ showGrid: newGridState });
  }, [showGrid, broadcastSettings]);

  return {
    zoom,
    showGrid,
    setZoom,
    setShowGrid,
    handleZoomChange,
    toggleGrid,
  };
};
