import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const lastJoinedCampaign = useRef(null);

  // 🧠 Setup socket on mount
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_BASE || 'http://localhost:5000');

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🔌 Global socket connected:', socket.id);
      setIsConnected(true);

      if (lastJoinedCampaign.current) {
        console.log('🔁 Rejoining campaign:', lastJoinedCampaign.current);
        socket.emit('join-campaign', lastJoinedCampaign.current);
      }
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Global socket disconnected');
      setIsConnected(false);
    });

    // Listen to other socket events as needed
    socket.on('map-uploaded', (data) => {
      console.log('📥 Received map upload event:', data);
    });

    return () => {
      console.log('🧹 Cleaning up socket connection');
      socket.disconnect();
    };
  }, []);

  // 📣 Join campaign room manually
  const joinCampaign = useCallback((campaignId) => {
    if (!campaignId || !socketRef.current) return;

    console.log('📣 Manually joining campaign room:', campaignId);
    socketRef.current.emit('join-campaign', campaignId);
    lastJoinedCampaign.current = campaignId;
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        joinCampaign,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
