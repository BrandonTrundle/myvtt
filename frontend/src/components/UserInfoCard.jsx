import React, { useRef, useState, useEffect, useContext } from 'react';
import { Bell, Mail } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api'; // adjust path as needed
import { API_BASE } from '../utils/api';


const UserInfoCard = ({ user, memberSince, hoursPlayed }) => {
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('/defaultav.png');
  const { fetchUser } = useContext(UserContext);

  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useEffect(() => {
    if (user.avatarUrl) {
      setAvatarUrl(`${API_BASE}${user.avatarUrl}`);
    }
  }, [user]);

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/user/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.avatarUrl) {
        setAvatarUrl(`${API_BASE}${data.avatarUrl}`);
        await fetchUser(); // 🔄 Refresh global user context so navbar icon updates too
      } else {
        alert(data.message || 'Failed to upload avatar');
      }
    } catch (err) {
      console.error('Upload error', err);
    }
  };

  return (
    <div className="flex items-center bg-white p-4 rounded border border-arcanabrown shadow-md text-sm text-arcanadeep max-w-md gap-4 relative">
      {/* Avatar */}
      <img
        src={avatarUrl}
        alt="User Avatar"
        onClick={handleAvatarClick}
        onError={() => setAvatarUrl('/defaultav.png')}
        className="w-16 h-16 rounded-full object-cover border cursor-pointer hover:shadow-md transition"
      />

      <input
        type="file"
        name="avatar" // ✅ Add this line
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />


      {/* Info */}
      <div className="flex-1">
        <h3 className="font-bold text-lg">{user.displayName || 'Adventurer'}</h3>
        <p className="text-sm text-gray-700">Tier: {user.subscriptionTier || 'Free'}</p>
        <p className="text-sm text-gray-700">
          Member since:{' '}
          {memberSince ? new Date(memberSince).toLocaleDateString() : 'N/A'}
        </p>
        <p className="text-sm text-gray-700">Hours Played: {hoursPlayed}</p>

        <button className="mt-2 text-arcanared underline text-sm hover:text-arcanabrown">
          Manage Account
        </button>

        {/* Icons below Manage Account */}
        <div className="mt-3 flex gap-4">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              alert('Notifications panel coming soon!');
              setHasNewNotifications(false);
            }}
          >
            <Bell className={`w-5 h-5 ${hasNewNotifications ? 'text-yellow-500' : 'text-gray-400'}`} />
            <span className="text-sm">Notifications</span>
          </div>

          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              alert('Messaging coming soon!');
            }}
          >
            <Mail className={`w-5 h-5 ${hasNewMessages ? 'text-yellow-500' : 'text-gray-400'}`} />
            <span className="text-sm">Messages</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
