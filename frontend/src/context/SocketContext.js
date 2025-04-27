/**
 * Author: Brandon Trundle
 * File Name: SocketContext.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides global access to a persistent WebSocket connection using socket.io-client.
 * Manages connection lifecycle, campaign room joining, and reconnection handling.
 * 
 * Behavior:
 * - Establishes WebSocket connection on component mount.
 * - Automatically reconnects and re-joins last campaign room after reconnect.
 * - Exposes socket instance and joinCampaign helper function to consumers.
 * 
 * Props:
 * - None (internal context provider).
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'; // React imports for context, lifecycle hooks, refs, state, and callbacks
import { io } from 'socket.io-client'; // Client library for WebSocket communication via Socket.IO


// Server base URL for WebSocket connection, derived from environment variables or defaults to localhost
const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE?.replace('/api', '') || 'http://localhost:5000';

// Context object for providing WebSocket connection access across the application
const SocketContext = createContext();

/**
 * SocketProvider Component
 * 
 * Wraps the application and initializes a persistent WebSocket connection.
 * Provides socket methods and connection status to child components.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Components that will have access to the WebSocket context
 * @returns {JSX.Element} - Context provider wrapping children
 */
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const lastJoinedCampaign = useRef(null);

/**
 * Establishes a WebSocket connection on mount.
 * Handles connect, disconnect, connect_error, and map_uploaded events.
 * Cleans up the connection on unmount.
 */
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

/**
 * Emits a socket event to join a specific campaign room.
 * 
 * @param {string} campaignId - ID of the campaign room to join
 */
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

/**
 * useSocket Hook
 * 
 * Custom hook to access the WebSocket connection and helper functions.
 * 
 * @returns {Object} - Socket connection object, isConnected boolean, joinCampaign function
 * @throws {Error} - If used outside of a SocketProvider
 */
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
