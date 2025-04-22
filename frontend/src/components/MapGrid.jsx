// 📂 frontend/components/MapGrid.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS';
import { useMapSocket } from '../hooks/useMapSocket';
import { useFetchMap } from '../hooks/useFetchMap';

const MapGrid = ({ campaign, isGM }) => {
  const [mapUrl, setMapUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const { socket, isConnected, joinCampaign } = useSocket();
  const campaignId = campaign?._id;

  useMapSocket(
    campaignId,
    (imageUrl) => setMapUrl(imageUrl),
    ({ zoom, showGrid }) => {
      if (zoom !== undefined) setZoom(zoom);
      if (showGrid !== undefined) setShowGrid(showGrid);
    }
  );

  useFetchMap(campaignId, setMapUrl);


  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('map', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${process.env.REACT_APP_API_BASE}/api/maps/${campaignId}/map`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.imageUrl) setMapUrl(res.data.imageUrl);
    } catch (err) {
      console.error('❌ Upload failed:', err);
    }
  };

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
          {mapUrl && (
            <img
              src={`${process.env.REACT_APP_API_BASE}${mapUrl}`}
              alt="Campaign Map"
              className="block max-w-none"
            />
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
