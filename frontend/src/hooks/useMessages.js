import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiFetch('/messages');
      setMessages(data);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = useCallback(async (messageId) => {
    try {
      await apiFetch(`/messages/${messageId}/read`, { method: 'PATCH' });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error('❌ Failed to mark message as read:', err);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      await apiFetch(`/messages/${messageId}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error('❌ Failed to delete message:', err);
      alert('Error deleting message.');
    }
  }, []);

  return {
    messages,
    loading,
    fetchMessages,
    markAsRead,
    deleteMessage,
    setMessages,
  };
}
