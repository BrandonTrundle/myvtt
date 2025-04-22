// 📂 frontend/hooks/useChatSocket.js
import { useEffect } from 'react';
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS';
import { useSocket } from '../context/SocketContext';

export function useChatSocket(campaignId, onMessage) {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !campaignId) return;

    socket.emit(SOCKET_EVENTS.JOIN_CAMPAIGN, campaignId);

    const handleMessage = (msg) => {
      onMessage(msg);
    };

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);
    };
  }, [socket, isConnected, campaignId, onMessage]);
}
