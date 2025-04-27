/**
 * Author: Brandon Trundle
 * File Name: useUnreadMessages.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook for checking if the current user has any unread messages.
 * 
 * Behavior:
 * - Fetches unread message count from the server on mount.
 * - Returns a boolean indicating if unread messages exist.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect, useState } from 'react'; // React hooks for side effects and local state management
import { apiFetch } from '../utils/api'; // API utility for sending server requests

/**
 * useUnreadMessages Hook
 * 
 * Checks if the user has any unread messages and returns a boolean.
 * 
 * @returns {boolean} - True if there are unread messages, otherwise false
 */
export function useUnreadMessages() {
  const [hasUnread, setHasUnread] = useState(false);
  
/**
 * Triggers checkMessages once when the hook initializes.
 */
  useEffect(() => {
/**
 * Fetches unread message count from the server.
 * 
 * Behavior:
 * - Sends a GET request to /messages/unread.
 * - Sets hasUnread state based on server response.
 * 
 * @throws {Error} - If network request fails
 */
    const checkMessages = async () => {
      try {
        // Directly use the data returned by apiFetch (it's already parsed as JSON)
        const data = await apiFetch('/messages/unread');
        
        // If data has 'unread' field, check if there are unread messages
        if (data && data.unread) {
          setHasUnread(data.unread > 0);
        } else {
          console.warn('⚠️ Invalid response format or no unread messages.');
        }
      } catch (err) {
        console.error('❌ Failed to check unread messages', err);
      }
    };

    checkMessages();
  }, []);

  return hasUnread;
}
