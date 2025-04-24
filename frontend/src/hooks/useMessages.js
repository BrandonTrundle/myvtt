import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await apiFetch('/messages');
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text); // ✅ Only try if it's real JSON
      } catch (err) {
        console.warn("⚠️ Could not parse JSON. Response was:", text);
        return; // Or handle fallback logic here
      }
      if (res.ok) setMessages(data);
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
      await apiFetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error('❌ Failed to mark as read:', err);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      const res = await apiFetch(`/api/messages/${messageId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        return true;
      } else {
        alert('Failed to delete message.');
        return false;
      }
    } catch (err) {
      console.error('❌ Failed to delete message:', err);
      alert('Error deleting message.');
      return false;
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
