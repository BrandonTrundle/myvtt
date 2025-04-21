import React, { useRef, useState } from 'react';
import { apiFetch, API_BASE } from '../utils/api';

const CampaignCard = ({
  campaign,
  onCopyCode,
  onDelete,
  onSendInvite,
  isCopied,
  isGM,
}) => {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(
    campaign.imageUrl ? `${API_BASE}${campaign.imageUrl}` : '/default-campaign.jpg'
  );
  const [uploading, setUploading] = useState(false);

  const handleImageClick = () => {
    if (isGM && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await apiFetch(`/api/campaigns/${campaign._id}/image`, {
        method: 'PATCH',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setImageUrl(`${API_BASE}${data.imageUrl}`);
      } else {
        alert(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded border border-arcanabrown shadow hover:shadow-md transition relative">
      {/* Campaign Image */}
      <div className="mb-4 relative">
        <img
          src={imageUrl}
          alt="Campaign"
          className={`w-full h-40 object-cover rounded cursor-pointer border ${
            isGM ? 'hover:opacity-80 transition' : ''
          }`}
          onClick={handleImageClick}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm text-arcanabrown">
            Uploading...
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </div>

      <h2 className="text-xl font-bold">{campaign.title}</h2>
      <p className="text-sm text-gray-700">System: {campaign.system}</p>
      {campaign.module && <p className="text-sm text-gray-700">Module: {campaign.module}</p>}
      <p className="text-sm text-gray-500 mt-1">
        Created: {new Date(campaign.createdAt).toLocaleDateString()}
      </p>

      <span className="inline-block mt-2 px-2 py-1 text-xs bg-arcanared text-white rounded">
        {isGM ? 'Game Master' : 'Player'}
      </span>

      {isGM && (
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p className="font-medium">Invite Code:</p>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 border px-2 py-1 rounded">{campaign.inviteCode}</span>
            <button
              onClick={() => onCopyCode(campaign.inviteCode)}
              className="text-xs text-blue-600 hover:underline"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <button
            onClick={() => onSendInvite(campaign)}
            className="text-xs text-green-700 underline hover:text-green-900"
          >
            Send Invite
          </button>

          <button
            onClick={() => onDelete(campaign._id)}
            className="text-xs text-arcanared underline hover:text-arcanabrown"
          >
            Delete Campaign
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
