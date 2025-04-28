// src/components/GameBoard/MapGrid/MapGrid.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useSocket } from '../../../context/SocketContext';
import { SOCKET_EVENTS } from '../../../constants/SOCKET_EVENTS';
import { useMapSocket } from '../../../hooks/useMapSocket';
import { useFetchMap } from '../../../hooks/useFetchMap';
import { STATIC_BASE } from '../../../utils/api';
import { UserContext } from '../../../context/UserContext';
import { useMapGridSocket } from './useMapGridSocket';
import MapCanvas from './MapCanvas';
import TokenLayer from './TokenLayer';
import MapControls from './MapControls';

const MapGrid = ({ campaign, isGM, selectedToken, setSelectedToken, isMeasureMode, setIsMeasureMode }) => {
  const [mapUrl, setMapUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [tokens, setTokens] = useState([]);
  const { socket } = useSocket();
  const { user } = useContext(UserContext);
  const campaignId = campaign?._id;
  const [measureTarget, setMeasureTarget] = useState(null);

  useMapSocket(
    campaignId,
    (imageUrl) => {
      const fullUrl = `${STATIC_BASE}${imageUrl}`;
      setMapUrl(fullUrl);
    },
    ({ zoom, showGrid }) => {
      if (zoom !== undefined) setZoom(zoom);
      if (showGrid !== undefined) setShowGrid(showGrid);
    }
  );

  useMapGridSocket({ socket, setTokens });

  useFetchMap(campaignId, (fetchedMapUrl) => {
    if (fetchedMapUrl) {
      const fullUrl = `${STATIC_BASE}${fetchedMapUrl}`;
      setMapUrl(fullUrl);
    }
  });

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
        setMapUrl(fullMapUrl);
        campaign.activeMap = res.data.activeMap;

        if (socket && isGM) {
          socket.emit(SOCKET_EVENTS.MAP_UPDATED, {
            campaignId,
            activeMap: res.data.activeMap,
          });
        }
      } else {
        alert('Upload succeeded, but server did not return a valid map. Please try again.');
      }
    } catch (err) {
      alert('Map upload failed. Please check your internet connection or try again.');
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const { id, name, portrait } = JSON.parse(data);
      const rect = e.currentTarget.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) / zoom;
      const rawY = (e.clientY - rect.top) / zoom;
      const gridSize = 64;
      const tokenSize = 48;
      const offset = (gridSize - tokenSize) / 2;

      const newX = Math.round(rawX / gridSize) * gridSize + offset;
      const newY = Math.round(rawY / gridSize) * gridSize + offset;

      const newToken = {
        id,
        name,
        portrait,
        x: newX,
        y: newY,
        type: 'player',
        campaignId,
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

      if (socket) {
        socket.emit(SOCKET_EVENTS.TOKEN_SPAWNED, newToken);
      }
    } catch (err) {
      console.error('Invalid drop data', err);
    }
  };

  const handleMapClick = (e) => {
    if (!isMeasureMode || !selectedToken) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;

    const gridSize = 64;
    const tokenSize = 48;
    const offset = (gridSize - tokenSize) / 2;

    const snappedX = Math.floor(rawX / gridSize) * gridSize + offset;
    const snappedY = Math.floor(rawY / gridSize) * gridSize + offset;

    setMeasureTarget({ x: snappedX, y: snappedY });
  };

  const handleTokenClick = (token) => {
    const canSelect = isGM || (user && token.ownerIds.includes(user._id));

    if (canSelect) {
      setSelectedToken((prev) => (prev && prev.id === token.id ? null : token));
    }
  };

  const handleTokenDragStart = (e, token) => {
    e.dataTransfer.setData('application/json', JSON.stringify(token));
  };

  const handleTokenDragEnd = (e, token) => {
    const rect = e.currentTarget.parentNode.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;

    const gridSize = 64;
    const tokenSize = 48;
    const offset = (gridSize - tokenSize) / 2;

    const newX = Math.round(rawX / gridSize) * gridSize + offset;
    const newY = Math.round(rawY / gridSize) * gridSize + offset;

    const updatedToken = { ...token, x: newX, y: newY };

    setTokens((prevTokens) =>
      prevTokens.map(t =>
        t.id === updatedToken.id && t.createdBy === updatedToken.createdBy ? updatedToken : t
      )
    );

    if (socket) {
      socket.emit('token_moved', updatedToken);
    }

    if (isMeasureMode && selectedToken && selectedToken.id === updatedToken.id) {
      setIsMeasureMode(false);
      setMeasureTarget(null);
      setSelectedToken(updatedToken);
    }
  };

  const calculateDistance = (start, end) => {
    const gridSize = 64;
    const startCol = Math.floor(start.x / gridSize);
    const startRow = Math.floor(start.y / gridSize);
    const endCol = Math.floor(end.x / gridSize);
    const endRow = Math.floor(end.y / gridSize);

    const deltaX = Math.abs(endCol - startCol);
    const deltaY = Math.abs(endRow - startRow);

    const diagonals = Math.min(deltaX, deltaY);
    const straights = Math.abs(deltaX - deltaY);

    return diagonals * 10 + straights * 5;
  };

  const gridSize = 64;
  const mapTileWidth = 25;
  const mapTileHeight = 25;
  const mapWidth = gridSize * mapTileWidth;
  const mapHeight = gridSize * mapTileHeight;

  return (
    <div className="map-grid mt-4 space-y-4">
      <h3 className="text-lg font-bold">🗺️ Campaign Map</h3>

      {isGM && (
        <div className="mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
        </div>
      )}

      <MapControls
        onZoomOut={() => handleZoomChange(-0.1)}
        onZoomIn={() => handleZoomChange(0.1)}
        onToggleGrid={toggleGrid}
        showGrid={showGrid}
      />

      <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleMapClick} className="relative">
        <MapCanvas mapUrl={mapUrl} zoom={zoom} showGrid={showGrid} />
        <TokenLayer
          tokens={tokens}
          selectedToken={selectedToken}
          userId={user?._id}
          isGM={isGM}
          zoom={zoom}
          onTokenClick={handleTokenClick}
          onTokenDragStart={handleTokenDragStart}
          onTokenDragEnd={handleTokenDragEnd}
        />

        {isMeasureMode && selectedToken && measureTarget && (
          <svg
            className="absolute top-0 left-0"
            style={{
              width: `${mapWidth}px`,
              height: `${mapHeight}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          >
            {(() => {
              const startX = selectedToken.x + 32;
              const startY = selectedToken.y + 32;
              const endX = measureTarget.x + 32;
              const endY = measureTarget.y + 32;

              const dx = endX - startX;
              const dy = endY - startY;
              const length = Math.sqrt(dx * dx + dy * dy);

              const shorten = 12;
              const adjustedEndX = endX - (dx / length) * shorten;
              const adjustedEndY = endY - (dy / length) * shorten;

              return (
                <line
                  x1={startX}
                  y1={startY}
                  x2={adjustedEndX}
                  y2={adjustedEndY}
                  stroke="cyan"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
              );
            })()}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="cyan" />
              </marker>
            </defs>
            <text
              x={(selectedToken.x + measureTarget.x) / 2 + 32}
              y={(selectedToken.y + measureTarget.y) / 2 + 32}
              fill="white"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              {calculateDistance(selectedToken, measureTarget)} ft
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};

export default React.memo(MapGrid);