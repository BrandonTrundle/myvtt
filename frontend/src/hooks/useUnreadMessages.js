import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useUnreadMessages() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
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
