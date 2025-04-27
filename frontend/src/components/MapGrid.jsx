/**
 * Author: Brandon Trundle
 * File Name: MapGrid.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays and manages the live campaign map for ArcanaTable sessions.
 * Supports real-time updates via WebSockets, manual uploads by the GM,
 * zoom controls, and toggling a grid overlay for players.
 * 
 * Features:
 * - GM can upload a new map image to the server.
 * - All users receive real-time map updates over WebSocket.
 * - Zoom in/out and show/hide grid toggles.
 * - Grid overlay to assist with positioning on maps.
 * 
 * Props:
 * - campaign (object): Campaign object containing the campaign's current map data.
 * - isGM (boolean): True if the current user is the GM of the campaign.
 */

import React, { useState } from 'react'; // React library and core hooks
import axios from 'axios'; // Promise-based HTTP client for making API requests
import { useSocket } from '../context/SocketContext'; // Custom hook for accessing the current Socket.IO connection
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS'; // Centralized socket event names
import { useMapSocket } from '../hooks/useMapSocket'; // Custom hook to handle incoming map socket events
import { useFetchMap } from '../hooks/useFetchMap'; // Custom hook to fetch saved campaign map on load
import { STATIC_BASE } from '../utils/api'; // Base URL for serving static assets

/**
 * MapGrid Component
 * 
 * Handles the display, upload, zoom, and real-time updating of the campaign map.
 * Provides different capabilities depending on whether the user is the GM or a player.
 * 
 * @param {Object} campaign - Campaign data object containing current map state.
 * @param {boolean} isGM - Whether the user is the Game Master (GM).
 */
const MapGrid = ({ campaign, isGM }) => {
  const [mapUrl, setMapUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const { socket } = useSocket();
  const campaignId = campaign?._id;

/**
 * Subscribe to real-time socket events:
 * - MAP_UPDATED: Update map image for all players.
 * - MAP_SETTINGS_UPDATED: Sync zoom and grid visibility settings.
 */
  useMapSocket(
    campaignId,
    (imageUrl) => {
      const fullUrl = `${STATIC_BASE}${imageUrl}`;
      console.log('🖼️ Player: received MAP_UPDATED fullUrl:', fullUrl);
      setMapUrl(fullUrl);
    },
    ({ zoom, showGrid }) => {
      if (zoom !== undefined) setZoom(zoom);
      if (showGrid !== undefined) setShowGrid(showGrid);
    }
  );

/**
 * Fetches the saved campaign map when the component first loads.
 * Sets the map URL if a map is found.
 */
  useFetchMap(campaignId, (fetchedMapUrl) => {
    if (fetchedMapUrl) {
      const fullUrl = `${STATIC_BASE}${fetchedMapUrl}`;
      console.log('🖼️ Initial fetchMapUrl on page load (fullUrl):', fullUrl);
      setMapUrl(fullUrl);
    }
  });
  
/**
 * Handles uploading a new map image file to the server (GM only).
 * Emits a real-time MAP_UPDATED event to all connected clients.
 */
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('map', file);
  
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${process.env.REACT_APP_API_BASE}/maps/${campaignId}/map`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (res.data?.activeMap) {
        const fullMapUrl = `${STATIC_BASE}${res.data.activeMap}`;
        console.log('🖼️ GM: setMapUrl after upload:', fullMapUrl);
        setMapUrl(fullMapUrl);
        campaign.activeMap = res.data.activeMap;
  
        if (socket && isGM) {
          console.log('📡 Emitting MAP_UPDATED with:', res.data.activeMap);
          socket.emit(SOCKET_EVENTS.MAP_UPDATED, {
            campaignId,
            activeMap: res.data.activeMap,
          });
        }
      } else {
        console.error('❌ Map upload response did not contain activeMap.');
        alert('Upload succeeded, but server did not return a valid map. Please try again.');
      }
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Map upload failed. Please check your internet connection or try again.');
    }
  };
  
/**
 * Emits updated zoom and/or grid visibility settings to connected clients.
 * 
 * @param {Object} newSettings - Partial settings to broadcast ({ zoom, showGrid }).
 */
  const broadcastSettings = (newSettings) => {
    if (socket && isGM) {
      socket.emit(SOCKET_EVENTS.MAP_SETTINGS_UPDATED, {
        zoom,
        showGrid,
        ...newSettings,
      });
    }
  };

/**
 * Handles zooming the map in or out.
 * Constrains zoom between 0.5x and 3x.
 * 
 * @param {number} delta - Amount to adjust zoom by (positive or negative).
 */
  const handleZoomChange = (delta) => {
    const newZoom = Math.min(3, Math.max(0.5, zoom + delta));
    setZoom(newZoom);
    broadcastSettings({ zoom: newZoom });
  };

/**
 * Toggles the visibility of the map grid overlay.
 */
  const toggleGrid = () => {
    const newGridState = !showGrid;
    setShowGrid(newGridState);
    broadcastSettings({ showGrid: newGridState });
  };

  return (
    <div className="map-grid mt-4 space-y-4">
      <h3 className="text-lg font-bold">🗺️ Campaign Map</h3>

      {isGM && (
        <div className="flex gap-4 items-center mb-2">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={() => handleZoomChange(-0.1)} className="px-2 py-1 border rounded">
            Zoom Out
          </button>
          <button onClick={() => handleZoomChange(0.1)} className="px-2 py-1 border rounded">
            Zoom In
          </button>
          <button onClick={toggleGrid} className="px-2 py-1 border rounded">
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
        </div>
      )}

      <div className="relative overflow-auto border rounded shadow max-w-full">
        <div
          className="relative inline-block"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          {mapUrl ? (
            <img
              src={mapUrl} // ✅ USE FULL URL DIRECTLY
              alt="Campaign Map"
              className="block max-w-none"
            />
          ) : (
            <p className="text-gray-500 p-4">Campaign Map will appear here.</p>
          )}

          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapGrid;
