// 📂 frontend/context/SocketContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { io } from 'socket.io-client';

// 🌐 Environment-based API base
const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE?.replace('/api', '') || 'http://localhost:5000';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const lastJoinedCampaign = useRef(null);

  useEffect(() => {
    console.log('🔌 Connecting to WebSocket server at:', SOCKET_SERVER_URL);
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setIsConnected(true);

      if (lastJoinedCampaign.current) {
        console.log('🔁 Rejoining campaign room:', lastJoinedCampaign.current);
        socket.emit('join_campaign', lastJoinedCampaign.current);
      }
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
    });

    socket.on('map_uploaded', (data) => {
      console.log('📥 Received MAP_UPLOADED event:', data);
    });

    return () => {
      console.log('🧹 Cleaning up WebSocket connection...');
      socket.disconnect();
    };
  }, []);

  const joinCampaign = useCallback((campaignId) => {
    if (!campaignId || !socketRef.current) return;
    if (lastJoinedCampaign.current === campaignId) {
      console.log('⏩ Already joined this campaign room, skipping rejoin.');
      return;
    }
    console.log('📣 Joining campaign room:', campaignId);
    socketRef.current.emit('join_campaign', campaignId);
    lastJoinedCampaign.current = campaignId;
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socketRef, // 🔥 Store the REF itself, not socketRef.current!
        isConnected,
        joinCampaign,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  const socket = context?.socketRef?.current || null;
  return {
    ...context,
    socket,
  };
};
