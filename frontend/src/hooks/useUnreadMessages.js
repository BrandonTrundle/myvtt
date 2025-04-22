import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useUnreadMessages() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkMessages = async () => {
      try {
        const res = await apiFetch('/api/messages/unread');
        const data = await res.json();
        setHasUnread(data.unread > 0);
      } catch (err) {
        console.error('❌ Failed to check unread messages', err);
      }
    };

    checkMessages();
  }, []);

  return hasUnread;
}
