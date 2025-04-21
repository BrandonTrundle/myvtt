import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import CampaignCard from '../components/CampaignCard';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
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
      }
    };

    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this campaign?');
    if (!confirmDelete) return;

    try {
      const res = await apiFetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert('Failed to delete.');
      }
    } catch (err) {
      console.error('❌ Failed to delete campaign:', err);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSendInvite = (campaign) => {
    alert(`TODO: Show message form to invite player to "${campaign.title}" with code ${campaign.inviteCode}`);
    // You can plug in a modal or inline form here later
  };

  return (
    <div className="bg-parchment min-h-screen p-8 text-arcanadeep">
      <h1 className="text-3xl font-bold mb-6">🎲 My Campaigns</h1>

      {campaigns.length === 0 ? (
        <p>No campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onDelete={handleDelete}
              onCopyCode={handleCopyCode}
              onSendInvite={handleSendInvite}
              isCopied={copiedCode === campaign.inviteCode}
              isGM={campaign.isGM}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
