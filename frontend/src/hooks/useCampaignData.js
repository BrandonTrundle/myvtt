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

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text); // ✅ Only try if it's real JSON
        } catch (err) {
          console.warn("⚠️ Could not parse JSON. Response was:", text);
          return; // Or handle fallback logic here
        }
        setCampaign(data);
      } catch (err) {
        console.error('❌ Error loading campaign:', err);
      }
    };

    if (campaignId) fetchCampaign();
  }, [campaignId, setCampaign]);
}
