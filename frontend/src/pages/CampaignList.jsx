/**
 * Author: Brandon Trundle
 * File Name: CampaignList.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays the user's list of campaigns, with options to create, join, delete, and manage campaigns.
 * 
 * Behavior:
 * - Fetches the user's campaigns from the server.
 * - Allows users to create new campaigns or join existing ones via invite code.
 * - Provides interaction handlers for deleting, copying invite codes, and managing invitations.
 * 
 * Props:
 * - None (page component using internal hooks and state).
 */

import React, { useState } from 'react'; // React library and hooks for state management
import { useNavigate } from 'react-router-dom'; // Hook for programmatic route navigation
import { apiFetch } from '../utils/api'; // Utility for sending authenticated server requests
import CampaignCard from '../components/Campaign/CampaignCard'; // Component for displaying individual campaign cards
import { useMyCampaigns } from '../components/Campaign/hooks/useMyCampaigns'; // Custom hook for fetching and managing user's campaigns

/**
 * CampaignList Component
 * 
 * Renders the list of campaigns the user is involved in.
 * Provides functionality to create, join, delete, and manage campaigns.
 * 
 * @returns {JSX.Element} - The rendered campaign list page
 */
const CampaignList = () => {
  const navigate = useNavigate(); // Create navigate function
  const { campaigns, setCampaigns, fetchCampaigns } = useMyCampaigns();
  const [copiedCode, setCopiedCode] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

/**
 * Deletes a campaign from the server and removes it from local state.
 * 
 * @param {string} campaignId - ID of the campaign to delete
 * @throws {Error} - If server request fails
 */
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

/**
 * Handles sending a campaign invite.
 * (Currently a placeholder for future custom invite modal functionality.)
 * 
 * @param {Object} campaign - Campaign object for which to send an invite
 */
  const handleSendInvite = (campaign) => {
    console.log("📤 Sending invite for campaign:", campaign._id);
    alert(`TODO: Custom invite modal — already functional inline.`);
  };

/**
 * Copies a campaign's invite code to the clipboard.
 * 
 * @param {string} code - Invite code to copy
 */
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

/**
 * Sends a join request using an invite code to join an existing campaign.
 * 
 * Behavior:
 * - Sends POST request to /campaigns/join/:inviteCode.
 * - Updates local campaign list on success.
 * 
 * @throws {Error} - If network request or server join fails
 */
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
  
/**
 * Redirects the user to the create new campaign page.
 */
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
