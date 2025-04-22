// 📂 frontend/hooks/useFetchMap.js
import { useEffect } from 'react';
import axios from 'axios';

export function useFetchMap(campaignId, setMapUrl) {
  useEffect(() => {
    const fetchMap = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE}/api/campaigns/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data?.mapUrl) setMapUrl(res.data.mapUrl);
      } catch (err) {
        console.warn('🕳️ No map or error fetching');
      }
    };

    if (campaignId) fetchMap();
  }, [campaignId, setMapUrl]);
}
