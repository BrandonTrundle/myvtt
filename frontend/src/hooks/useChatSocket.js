/**
 * Author: Brandon Trundle
 * File Name: useChatSocket.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook to subscribe to incoming chat messages over WebSocket for a given campaign.
 * 
 * Behavior:
 * - Subscribes to CHAT_MESSAGE events when socket and campaignId are available.
 * - Automatically cleans up the listener on unmount or when dependencies change.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect } from 'react'; // React hook for managing side effects
import { useSocket } from '../context/SocketContext'; // Custom hook for accessing WebSocket connection
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS'; // Centralized WebSocket event names

/**
 * useChatSocket Hook
 * 
 * Listens for incoming chat messages on the active WebSocket connection.
 * Invokes the provided callback function when a new message is received.
 * 
 * @param {string} campaignId - ID of the current campaign room
 * @param {Function} onMessageReceived - Callback to handle incoming chat messages
 * @returns {void}
 */
export const useChatSocket = (campaignId, onMessageReceived) => {
  const { socket } = useSocket();
  
/**
 * Subscribes to the CHAT_MESSAGE socket event.
 * 
 * Behavior:
 * - Registers the event listener when the socket and campaignId are ready.
 * - Calls onMessageReceived with the received chat message.
 * - Cleans up the event listener when the component unmounts or dependencies change.
 */
  useEffect(() => {
    if (!socket || !campaignId) return;
  
    const handleChatMessage = (message) => {
      console.log('📥 Received chat_message event:', message);
      onMessageReceived(message);
    };
  
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, handleChatMessage);
  
    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE, handleChatMessage);
    };
  }, [socket, campaignId, onMessageReceived]); // ← this now STABLE!
  
};
