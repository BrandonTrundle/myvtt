// src/components/GameBoard/MapGrid/hooks/useTokenSelection.js

import { useCallback } from 'react';

export const useTokenSelection = ({ user, isGM, setSelectedToken }) => {
  const handleTokenClick = useCallback((token) => {
    const canSelect = isGM || (user && token.ownerIds.includes(user._id));
    if (canSelect) {
      setSelectedToken((prev) => (prev && prev.id === token.id ? null : token));
    }
  }, [user, isGM, setSelectedToken]);

  return { handleTokenClick };
};
