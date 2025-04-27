/**
 * Author: Brandon Trundle
 * File Name: useMessages.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook for managing user messages, including fetching, marking as read, and deleting messages.
 * 
 * Behavior:
 * - Fetches the user's messages from the server on mount.
 * - Provides handlers to mark messages as read and delete messages.
 * - Tracks loading state for asynchronous operations.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect, useState, useCallback } from 'react'; // React hooks for side effects, state management, and stable function references
import { apiFetch } from '../utils/api'; // API utility for making server requests

/**
 * useMessages Hook
 * 
 * Manages the user's messages including loading, fetching, updating, and deleting.
 * 
 * @returns {Object} - { messages, loading, fetchMessages, markAsRead, deleteMessage, setMessages }
 */
export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

/**
 * Fetches all user messages from the server.
 * 
 * Behavior:
 * - Sends a GET request to /messages.
 * - Updates local message state with the response.
 * 
 * @throws {Error} - If network request fails
 */
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

/**
 * Fetches messages once when the hook is initialized.
 */
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

/**
 * Marks a specific message as read on the server and updates local state.
 * 
 * @param {string} messageId - ID of the message to mark as read
 * @throws {Error} - If network request fails
 */
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
  
/**
 * Deletes a specific message from the server and removes it from local state.
 * 
 * @param {string} messageId - ID of the message to delete
 * @throws {Error} - If network request fails
 */
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
