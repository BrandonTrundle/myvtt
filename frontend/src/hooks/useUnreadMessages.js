import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useUnreadMessages() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkMessages = async () => {
      try {
        const res = await apiFetch('/messages/unread');
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text); // ✅ Only try if it's real JSON
        } catch (err) {
          console.warn("⚠️ Could not parse JSON. Response was:", text);
          return; // Or handle fallback logic here
        }
        setHasUnread(data.unread > 0);
      } catch (err) {
        console.error('❌ Failed to check unread messages', err);
      }
    };

    checkMessages();
  }, []);

  return hasUnread;
}
