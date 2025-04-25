import { useEffect, useState, useContext } from 'react';
import { apiFetch } from '../utils/api';
import { UserContext } from '../context/UserContext';

export function useMyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const fetchCampaigns = async () => {
    try {
      const data = await apiFetch('/campaigns/mine');

      // Inject isGM based on match with logged-in user
      const withFlags = data.map(camp => ({
        ...camp,
        isGM: user && camp.gm === user._id
      }));

      setCampaigns(withFlags);
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
