import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useMyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch('/api/campaigns/mine');
      const data = await res.json();
      if (res.ok) {
        setCampaigns(data);
      } else {
        console.error('Failed to fetch campaigns:', data.message);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return { campaigns, setCampaigns, fetchCampaigns, loading };
}
