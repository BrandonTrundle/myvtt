import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate hook
import { apiFetch } from '../utils/api';
import CampaignCard from '../components/CampaignCard';
import { useMyCampaigns } from '../hooks/useMyCampaigns';

const CampaignList = () => {
  const navigate = useNavigate(); // Create navigate function
  const { campaigns, setCampaigns, fetchCampaigns } = useMyCampaigns();
  const [copiedCode, setCopiedCode] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
  
    try {
      await apiFetch(`/campaigns/${campaignId}`, { method: 'DELETE' });
      setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
      console.log("✅ Campaign deleted:", campaignId);
    } catch (err) {
      console.error('❌ Failed to delete campaign:', err);
      alert(err.message || 'Failed to delete campaign.');
    }
  };

  const handleSendInvite = (campaign) => {
    console.log("📤 Sending invite for campaign:", campaign._id);
    alert(`TODO: Custom invite modal — already functional inline.`);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;

    setJoinLoading(true);
    console.log("📡 Attempting to join campaign with code:", joinCode);
    try {
      const res = await apiFetch(`/campaigns/join/${joinCode.trim()}`, {
        method: 'POST',
      });

      const data = res;

      if (data && data._id) {
        alert('🎉 Successfully joined the campaign!');
        setJoinCode('');
        fetchCampaigns(); // Refresh list
        console.log("✅ Successfully joined the campaign:", joinCode);
      } else {
        alert(data.message || 'Failed to join.');
        console.warn("⚠️ Failed to join campaign:", data.message);
      }
    } catch (err) {
      console.error('❌ Error joining campaign:', err);
      alert('Something went wrong.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreateNewCampaign = () => {
    navigate('/create-campaign'); // Navigate to the create new campaign page
  };

  return (
    <div className="bg-parchment min-h-screen p-8 text-arcanadeep">
      <h1 className="text-3xl font-bold mb-6">🎲 My Campaigns</h1>

      {/* Create New Campaign Button */}
      <div className="mb-6 max-w-md bg-white p-4 rounded shadow border border-arcanabrown">
        <button
          onClick={handleCreateNewCampaign}
          className="bg-arcanared text-white px-4 py-2 rounded hover:bg-arcanabrown transition"
        >
          + Create New Campaign
        </button>
      </div>

      {/* Join Campaign Box */}
      <div className="mb-6 max-w-md bg-white p-4 rounded shadow border border-arcanabrown">
        <h2 className="text-lg font-semibold mb-2">Join a Campaign</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter invite code..."
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="flex-1 border px-3 py-2 rounded text-sm"
          />
          <button
            onClick={handleJoin}
            disabled={joinLoading}
            className="bg-arcanared text-white px-4 py-2 text-sm rounded hover:bg-arcanabrown transition"
          >
            {joinLoading ? 'Joining...' : 'Join'}
          </button>
        </div>
      </div>

      {/* Campaign Grid */}
      {campaigns.length === 0 ? (
        <p>No campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onDelete={handleDeleteCampaign}
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
