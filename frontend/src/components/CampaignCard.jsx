import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, API_BASE, STATIC_BASE } from '../utils/api';
import { Trash2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

const CampaignCard = ({ campaign, onCopyCode, onDelete, onSendInvite, isCopied }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  const isGM = campaign?.gm?._id === currentUser?._id;
console.log('🎭 isGM:', isGM);
console.log('👤 currentUser._id:', currentUser?._id);
console.log('🎲 campaign.gm:', campaign.gm);
console.log('🧑‍🤝‍🧑 campaign.players:', campaign.players);

  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('/default-campaign.jpg');
  const [uploading, setUploading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteTo, setInviteTo] = useState('');
  const [sending, setSending] = useState(false);
  const handleDelete = () => {
    if (onDelete) {
      onDelete(campaign._id);
    }
  };

  useEffect(() => {
    if (campaign?.imageUrl) {
      setImageUrl(`${STATIC_BASE}${campaign.imageUrl}`);
    } else {
      setImageUrl('default images/default-campaign.jpg');
    }
  }, [campaign]);

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
      const data = await apiFetch(`/campaigns/${campaign._id}/image`, {
        method: 'PATCH',
        body: formData,
      });

      if (data?.imageUrl) {
        setImageUrl(`${STATIC_BASE}${data.imageUrl}`);
      }
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      alert(err.message || 'Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteTo.trim()) {
      alert('Please enter a username.');
      return;
    }

    setSending(true);
    try {
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          toUsername: inviteTo.trim(),
          subject: `You're invited to join: ${campaign.title}`,
          body: `You've been invited to join "${campaign.title}".\n\nUse invite code: ${campaign.inviteCode} to join.`,
        }),
      });

      alert('Invite sent!');
      setIsInviting(false);
      setInviteTo('');
    } catch (err) {
      console.error('❌ Failed to send invite:', err);
      alert(err.message || 'Error sending invite.');
    } finally {
      setSending(false);
    }
  };

  const handleEnterTable = () => {
    navigate(`/table/${campaign._id}`);
  };

  return (
    <div className="bg-white p-4 rounded border border-arcanabrown shadow hover:shadow-md transition relative">
      {/* Campaign Image */}
      <div className="mb-4 relative">
        <img
          src={imageUrl}
          alt="Campaign"
          className={`w-full h-40 object-cover rounded cursor-pointer border ${isGM ? 'hover:opacity-80 transition' : ''}`}
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
  
      {/* Campaign Info */}
      <h2 className="text-xl font-bold">{campaign.title}</h2>
      <p className="text-sm text-gray-700">System: {campaign.system}</p>
      {campaign.module && <p className="text-sm text-gray-700">Module: {campaign.module}</p>}
      <p className="text-sm text-gray-500 mt-1">
        Created: {new Date(campaign.createdAt).toLocaleDateString()}
      </p>
  
      {/* Role Badge */}
      {(() => {
        const isPlayer = campaign.players?.some((p) => String(p._id || p) === currentUser._id);
        if (isGM || isPlayer) {
          return (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-arcanared text-white rounded">
              {isGM ? 'Game Master' : 'Player'}
            </span>
          );
        }
        return null;
      })()}
  
      {/* Avatar Row */}
      <div className="flex items-center flex-wrap gap-2 mt-4">
        {/* GM Avatar (if not GM yourself) */}
        {campaign.gm && (
          <div className="relative group">
            <img
              src={campaign.gm.avatarUrl ? `${STATIC_BASE}${campaign.gm.avatarUrl}` : '/defaultav.png'}
              alt="GM"
              className="w-10 h-10 rounded-full border"
            />
            <div className="absolute bottom-0 left-0 transform translate-y-full bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
              {campaign.gm.displayName || 'GM'}
            </div>
          </div>
        )}
  
        {/* Players */}
        {campaign.players?.map((player) => (
          <div className="relative group" key={player._id}>
            <img
              src={player.avatarUrl ? `${STATIC_BASE}${player.avatarUrl}` : '/defaultav.png'}
              alt="Player"
              className="w-10 h-10 rounded-full border"
            />
            <div className="absolute bottom-0 left-0 transform translate-y-full bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              {player.displayName || 'Player'}
            </div>
          </div>
        ))}
      </div>
  
      {/* Controls */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        {isGM ? (
          <>
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
              onClick={() => setIsInviting((prev) => !prev)}
              className="text-xs text-green-700 underline hover:text-green-900"
            >
              {isInviting ? 'Cancel Invite' : 'Send Invite'}
            </button>
  
            {isInviting && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={inviteTo}
                  onChange={(e) => setInviteTo(e.target.value)}
                  placeholder="Username to invite"
                  className="w-full border p-2 rounded text-sm"
                />
                <button
                  onClick={handleSendInvite}
                  disabled={sending}
                  className="bg-arcanared text-white px-3 py-1 rounded text-sm hover:bg-arcanabrown"
                >
                  {sending ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            )}
  
            <button
              onClick={handleEnterTable}
              className="mt-4 text-sm bg-arcanared text-white px-3 py-2 rounded hover:bg-arcanabrown transition w-full"
            >
              🚀 Launch Campaign
            </button>
  
            {isGM && (
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 mt-2 hover:underline"
              >
                <Trash2 className="inline-block w-4 h-4 mr-1" />
                Delete Campaign
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleEnterTable}
            className="mt-4 text-sm bg-arcanared text-white px-3 py-2 rounded hover:bg-arcanabrown transition w-full"
          >
            🧭 Join Table
          </button>
        )}
      </div>
    </div>
  );
};
export default CampaignCard;