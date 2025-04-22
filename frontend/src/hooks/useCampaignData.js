import { useEffect } from 'react';

export function useCampaignData(campaignId, setCampaign) {
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error('❌ Failed to fetch campaign');
          return;
        }

        const data = await res.json();
        setCampaign(data);
      } catch (err) {
        console.error('❌ Error loading campaign:', err);
      }
    };

    if (campaignId) fetchCampaign();
  }, [campaignId, setCampaign]);
}
