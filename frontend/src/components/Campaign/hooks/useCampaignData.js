import { useEffect } from 'react';

export function useCampaignData(campaignId, setCampaign) {
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error('❌ Failed to fetch campaign');
          return;
        }

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.warn("⚠️ Could not parse JSON. Response was:", text);
          return;
        }
        setCampaign(data);
      } catch (err) {
        console.error('❌ Error loading campaign:', err);
      }
    };
    console.log("🎯 useCampaignData triggered, fetching campaign");
    if (campaignId) fetchCampaign();
  }, [campaignId]); // ✅ Only depend on campaignId
}
