import { useCallback } from 'react';

export const useMeasureMode = ({ zoom, selectedToken, isMeasureMode, setMeasureTarget }) => {
  const handleMouseMove = useCallback((e) => {
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
  }, [isMeasureMode, selectedToken, zoom, setMeasureTarget]);

  const handleMapClick = useCallback((e) => {
    // Optional: Finalize or reset measuring on click
    // (could reset measureTarget here if you want)
  }, []);

  const calculateDistance = useCallback((start, end) => {
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
  }, []);

  return {
    handleMapClick,
    handleMouseMove,
    calculateDistance,
  };
};
