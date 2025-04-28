// src/components/GameBoard/MapGrid/MapGrid.jsx

import React, { useContext } from 'react';
import axios from 'axios';
import { useSocket } from '../../../context/SocketContext';
import { UserContext } from '../../../context/UserContext';
import { SOCKET_EVENTS } from '../../../constants/SOCKET_EVENTS';
import { STATIC_BASE } from '../../../utils/api';
import { useMapSocket } from '../../../hooks/useMapSocket';
import { useFetchMap } from '../../../hooks/useFetchMap';
import { useMapSettings } from './hooks/useMapSettings';
import { useTokenDragDrop } from './hooks/useTokenDragDrop';
import { useMeasureMode } from './hooks/useMeasureMode';
import { useMapGridSocket } from './hooks/useMapGridSocket';

import MapCanvas from './MapCanvas';
import TokenLayer from './TokenLayer';
import MapControls from './MapControls';

const MapGrid = ({ 
  campaign, isGM, selectedToken, setSelectedToken, isMeasureMode, setIsMeasureMode, measureTarget, setMeasureTarget
}) => {
  const { socket } = useSocket();
  const { user } = useContext(UserContext);

  const [mapUrl, setMapUrl] = React.useState(null);
  const [tokens, setTokens] = React.useState([]);
  const [otherPlayersMeasurements, setOtherPlayersMeasurements] = React.useState({});
  const campaignId = campaign?._id;

  const { zoom, showGrid, setZoom, setShowGrid, handleZoomChange, toggleGrid } = useMapSettings({ socket, isGM });
  const { handleMapClick, handleMouseMove, calculateDistance } = useMeasureMode({ zoom, selectedToken, isMeasureMode, setMeasureTarget });
  const { handleDragOver, handleDrop, handleTokenDragStart, handleTokenDragEnd } = useTokenDragDrop({
    zoom, setTokens, socket, user, isGM, isMeasureMode, selectedToken, setIsMeasureMode, setMeasureTarget, setSelectedToken, campaignId
  });

  useMapSocket(campaignId, (imageUrl) => {
    const fullUrl = `${STATIC_BASE}${imageUrl}`;
    setMapUrl(fullUrl);
  }, ({ zoom, showGrid }) => {
    if (zoom !== undefined) setZoom(zoom);
    if (showGrid !== undefined) setShowGrid(showGrid);
  });

  useMapGridSocket({ socket, setTokens });

  React.useEffect(() => {
    if (!socket) return;
    const handlePlayerMeasuring = ({ tokenId, from, to }) => {
      setOtherPlayersMeasurements((prev) => ({ ...prev, [tokenId]: { from, to } }));
    };
    socket.on(SOCKET_EVENTS.PLAYER_MEASURING, handlePlayerMeasuring);
    return () => socket.off(SOCKET_EVENTS.PLAYER_MEASURING, handlePlayerMeasuring);
  }, [socket]);

  useFetchMap(campaignId, (fetchedMapUrl) => {
    if (fetchedMapUrl) setMapUrl(`${STATIC_BASE}${fetchedMapUrl}`);
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
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data?.activeMap) {
        setMapUrl(`${STATIC_BASE}${res.data.activeMap}`);
        campaign.activeMap = res.data.activeMap;
        if (socket && isGM) {
          socket.emit(SOCKET_EVENTS.MAP_UPDATED, { campaignId, activeMap: res.data.activeMap });
        }
      } else {
        alert('Upload succeeded, but server did not return a valid map. Please try again.');
      }
    } catch {
      alert('Map upload failed. Please check your internet connection or try again.');
    }
  };

  const handleTokenClick = (token) => {
    const canSelect = isGM || (user && token.ownerIds.includes(user._id));
    if (canSelect) {
      setSelectedToken((prev) => (prev && prev.id === token.id ? null : token));
    }
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
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        </div>
      )}

      <MapControls
        onZoomOut={() => handleZoomChange(-0.1)}
        onZoomIn={() => handleZoomChange(0.1)}
        onToggleGrid={toggleGrid}
        showGrid={showGrid}
      />

      <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleMapClick} onMouseMove={handleMouseMove} className="relative">
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

        {(isMeasureMode && selectedToken && measureTarget) || Object.keys(otherPlayersMeasurements).length > 0 ? (
          <svg
            className="absolute top-0 left-0"
            style={{ width: `${mapWidth}px`, height: `${mapHeight}px`, transform: `scale(${zoom})`, transformOrigin: 'top left', pointerEvents: 'none' }}
          >
            {Object.entries(otherPlayersMeasurements).map(([tokenId, { from, to }]) => {
              const startX = Math.floor(from.x / gridSize) * gridSize + gridSize / 2;
              const startY = Math.floor(from.y / gridSize) * gridSize + gridSize / 2;
              const endX = Math.floor(to.x / gridSize) * gridSize + gridSize / 2;
              const endY = Math.floor(to.y / gridSize) * gridSize + gridSize / 2;
              return <line key={tokenId} x1={startX} y1={startY} x2={endX} y2={endY} stroke="magenta" strokeWidth="2" markerEnd="url(#arrowhead)" />;
            })}

            {isMeasureMode && selectedToken && measureTarget && (() => {
              const startX = Math.floor(selectedToken.x / gridSize) * gridSize + gridSize / 2;
              const startY = Math.floor(selectedToken.y / gridSize) * gridSize + gridSize / 2;
              const endX = measureTarget.x;
              const endY = measureTarget.y;

              return (
                <>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="cyan" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <text x={(startX + endX) / 2} y={(startY + endY) / 2} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">
                    {calculateDistance(selectedToken, measureTarget)} ft
                  </text>
                </>
              );
            })()}

            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="cyan" />
              </marker>
            </defs>
          </svg>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(MapGrid);
