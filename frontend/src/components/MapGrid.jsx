// 📂 frontend/components/MapGrid.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS';
import { useMapSocket } from '../hooks/useMapSocket';
import { useFetchMap } from '../hooks/useFetchMap';
import { STATIC_BASE } from '../utils/api';

const MapGrid = ({ campaign, isGM }) => {
  const [mapUrl, setMapUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const { socket } = useSocket();
  const campaignId = campaign?._id;

  // 🧠 Handle incoming socket map updates
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

  // 🧠 Fetch saved map when page loads
  useFetchMap(campaignId, (fetchedMapUrl) => {
    if (fetchedMapUrl) {
      const fullUrl = `${STATIC_BASE}${fetchedMapUrl}`;
      console.log('🖼️ Initial fetchMapUrl on page load (fullUrl):', fullUrl);
      setMapUrl(fullUrl);
    }
  });
  

  // 🧠 GM uploads new map
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
  
  // 🧠 Handle zoom and grid toggle
  const broadcastSettings = (newSettings) => {
    if (socket && isGM) {
      socket.emit(SOCKET_EVENTS.MAP_SETTINGS_UPDATED, {
        zoom,
        showGrid,
        ...newSettings,
      });
    }
  };

  const handleZoomChange = (delta) => {
    const newZoom = Math.min(3, Math.max(0.5, zoom + delta));
    setZoom(newZoom);
    broadcastSettings({ zoom: newZoom });
  };

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
