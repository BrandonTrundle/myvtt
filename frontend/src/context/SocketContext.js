// 📂 frontend/context/SocketContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastCampaignId, setLastCampaignId] = useState(null);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_BASE || 'http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('🔌 Global socket connected:', socketRef.current.id);
      setIsConnected(true);

      if (lastCampaignId) {
        console.log('🔁 Auto rejoining campaign:', lastCampaignId);
        socketRef.current.emit('join-campaign', lastCampaignId);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.warn('⚠️ Global socket disconnected');
      setIsConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [lastCampaignId]);

  const joinCampaign = (campaignId) => {
    if (socketRef.current && campaignId) {
      console.log('📣 Manually joining campaign room:', campaignId);
      socketRef.current.emit('join-campaign', campaignId);
      setLastCampaignId(campaignId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, joinCampaign }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
