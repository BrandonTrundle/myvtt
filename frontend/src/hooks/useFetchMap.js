// 📂 frontend/hooks/useFetchMap.js
import { useEffect } from 'react';
import axios from 'axios';

export function useFetchMap(campaignId, setMapUrl) {
  useEffect(() => {
    const fetchMap = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE}/campaigns/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.activeMap) {
          setMapUrl(res.data.activeMap); // ✅ use activeMap, not mapUrl
        } else {
          console.warn('🕳️ No active map found.');
        }
      } catch (err) {
        console.warn('❌ Error fetching map:', err);
      }
    };

    if (campaignId) fetchMap();
  }, [campaignId, setMapUrl]);
}
