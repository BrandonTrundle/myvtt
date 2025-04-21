import React, { useRef, useState, useEffect } from 'react';

const UserInfoCard = ({ user, memberSince, hoursPlayed }) => {
  const fileInputRef = useRef(null);

  const [avatarUrl, setAvatarUrl] = useState('/defaultav.png');

  // Update avatarUrl when the user data loads
  useEffect(() => {
    if (user.avatarUrl) {
      setAvatarUrl(`http://localhost:5000${user.avatarUrl}`);
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Open file picker
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.avatarUrl) {
        setAvatarUrl(`http://localhost:5000${data.avatarUrl}`);
      } else {
        alert(data.message || 'Failed to upload avatar');
      }
    } catch (err) {
      console.error('Upload error', err);
    }
  };

  return (
    <div className="flex items-center bg-white p-4 rounded border border-arcanabrown shadow-md text-sm text-arcanadeep max-w-md gap-4">
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
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Info */}
      <div>
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
      </div>
    </div>
  );
};

export default UserInfoCard;
