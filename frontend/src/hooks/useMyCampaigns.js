import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export function useMyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch('/campaigns/mine');
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text); // ✅ Only try if it's real JSON
      } catch (err) {
        console.warn("⚠️ Could not parse JSON. Response was:", text);
        return; // Or handle fallback logic here
      }
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
