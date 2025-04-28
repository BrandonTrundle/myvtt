// src/components/GameBoard/MapGrid/MapGrid.jsx

import React, { useContext } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { UserContext } from '../../../context/UserContext';
import { STATIC_BASE } from '../../../utils/api';
import { useMapSocket } from '../hooks/useMapSocket';
import { useFetchMap } from '../hooks/useFetchMap';
import { SOCKET_EVENTS } from '../../../constants/SOCKET_EVENTS'; //
import { useMapSettings } from '../hooks/useMapSettings';
import { useTokenDragDrop } from '../hooks/useTokenDragDrop';
import { useMeasureMode } from '../hooks/useMeasureMode';
import { useMapGridSocket } from '../hooks/useMapGridSocket';
import { useMapUpload } from '../hooks/useMapUpload';
import { useTokenSelection } from '../hooks/useTokenSelection';



import { GRID_SIZE, MAP_TILE_WIDTH, MAP_TILE_HEIGHT } from './Constants/mapConstants';

import MapCanvas from './Canvas/MapCanvas';
import MapControls from './Controls/MapControls';
import TokenLayer from './Layers/TokenLayer';
import MeasureLayer from './Layers/MeasureLayer';


const MapGrid = ({
  campaign, isGM, selectedToken, setSelectedToken,
  isMeasureMode, setIsMeasureMode, measureTarget, setMeasureTarget
}) => {
  const { socket } = useSocket();
  const { user } = useContext(UserContext);

  const [mapUrl, setMapUrl] = React.useState(null);
  const [tokens, setTokens] = React.useState([]);
  const [otherPlayersMeasurements, setOtherPlayersMeasurements] = React.useState({});

  const campaignId = campaign?._id;

  const { zoom, showGrid, setZoom, setShowGrid, handleZoomChange, toggleGrid } = useMapSettings({ socket, isGM });
  const { handleMapClick, handleMouseMove, handleMouseLeave, calculateDistance } = useMeasureMode({
    zoom, selectedToken, isMeasureMode, setMeasureTarget, campaignId,
  });
  const { handleDragOver, handleDrop, handleTokenDragStart, handleTokenDragEnd } = useTokenDragDrop({
    zoom, setTokens, socket, user, isGM, isMeasureMode, selectedToken,
    setIsMeasureMode, setMeasureTarget, setSelectedToken, campaignId,
  });
  const { handleFileUpload } = useMapUpload({ campaignId, campaign, setMapUrl, socket, isGM });
  const { handleTokenClick } = useTokenSelection({ user, isGM, setSelectedToken });

  useMapSocket(campaignId, (imageUrl) => {
    setMapUrl(`${STATIC_BASE}${imageUrl}`);
  }, ({ zoom, showGrid }) => {
    if (zoom !== undefined) setZoom(zoom);
    if (showGrid !== undefined) setShowGrid(showGrid);
  });

  useMapGridSocket({ socket, setTokens });

  useFetchMap(campaignId, (fetchedMapUrl) => {
    if (fetchedMapUrl) setMapUrl(`${STATIC_BASE}${fetchedMapUrl}`);
  });

  React.useEffect(() => {
    if (!socket) return;

    const handlePlayerMeasuring = ({ tokenId, from, to }) => {
      setOtherPlayersMeasurements((prev) => {
        const updated = { ...prev };
        if (from === null || to === null) {
          delete updated[tokenId];
        } else {
          updated[tokenId] = { from, to };
        }
        return updated;
      });
    };

    socket.on(SOCKET_EVENTS.PLAYER_MEASURING, handlePlayerMeasuring);
    return () => socket.off(SOCKET_EVENTS.PLAYER_MEASURING, handlePlayerMeasuring);
  }, [socket]);

  // const mapWidth = GRID_SIZE * MAP_TILE_WIDTH;
  // const mapHeight = GRID_SIZE * MAP_TILE_HEIGHT;

  return (
    <div className="map-grid mt-4 space-y-4">
      <h3 className="text-lg font-bold">🗘️ Campaign Map</h3>

      {isGM && (
        <div className="mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
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

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
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
        {(isMeasureMode && selectedToken && measureTarget) ||
        Object.keys(otherPlayersMeasurements).length > 0 ? (
          <MeasureLayer
            zoom={zoom}
            mapTileWidth={MAP_TILE_WIDTH}
            mapTileHeight={MAP_TILE_HEIGHT}
            selectedToken={selectedToken}
            measureTarget={measureTarget}
            otherPlayersMeasurements={otherPlayersMeasurements}
            calculateDistance={calculateDistance}
          />
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(MapGrid);
