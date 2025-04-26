// 📂 frontend/hooks/useChatSocket.js
import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS';

export const useChatSocket = (campaignId, onMessageReceived) => {
  const { socket } = useSocket();

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
