/**
 * Author: Brandon Trundle
 * File Name: UserInfoCard.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays a user's profile information card, including avatar, subscription tier, and gameplay statistics.
 * Allows the user to upload a custom avatar, view notifications, and navigate to messages.
 * 
 * Behavior:
 * - Loads and displays avatar and user information.
 * - Handles avatar upload through an API call.
 * - Provides UI interactions for notifications and messaging.
 * 
 * Props:
 * - user (object): The user object containing avatar, display name, and subscription tier.
 * - memberSince (string): ISO date when the user account was created.
 * - hoursPlayed (number): Number of hours the user has played on ArcanaTable.
 */


import React, { useRef, useState, useEffect, useContext, useCallback } from 'react'; // React imports for refs, state, effects, context, and callbacks
import { Bell, Mail } from 'lucide-react'; // Lucide icons for notifications and messaging
import { UserContext } from '../../../context/UserContext'; // Context providing user profile and authentication functions
import { useNavigate } from 'react-router-dom'; // Hook for programmatic route navigation
import { apiFetch, API_BASE } from '../../../utils/api'; // API utility function and base URL constant
import { useUnreadMessages } from '../Messaging/hooks/useUnreadMessages';// Custom hook to detect if there are unread messages

/**
 * UserInfoCard Component
 * 
 * Displays a card containing the user's avatar, account details, and quick actions.
 * Handles avatar uploads and renders visual indicators for notifications and unread messages.
 * 
 * @param {Object} props - React component props
 * @param {Object} props.user - Current user object
 * @param {string} props.memberSince - Account creation date
 * @param {number} props.hoursPlayed - Total hours the user has played
 * @returns {JSX.Element} - Rendered user information card
 */
const UserInfoCard = ({ user, memberSince, hoursPlayed }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { fetchUser } = useContext(UserContext);
  const BASE_URL = API_BASE.replace('/api', '');
  const [avatarUrl, setAvatarUrl] = useState('/defaultav.png');
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const hasNewMessages = useUnreadMessages(); // 🔁 Refactored
  
/**
 * Updates the avatar display whenever the user object changes.
 * Falls back to a default avatar if no custom avatar is available.
 */
useEffect(() => {
  if (user.avatarUrl) {
    setAvatarUrl(`${BASE_URL}${user.avatarUrl}`);
    console.log("✅ Avatar URL updated:", `${BASE_URL}${user.avatarUrl}`);
  }
}, [user, BASE_URL]);
  
/**
 * Opens the file input dialog when the user clicks their avatar image.
 */
  const handleAvatarClick = () => {
    console.log("🖼️ Avatar clicked, opening file input...");
    fileInputRef.current?.click();
  };

/**
 * Handles avatar file selection and uploads the new avatar to the server.
 * 
 * @param {Event} e - File input change event
 * @throws {500} If server error occurs during avatar upload
 */
const handleFileChange = useCallback(async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  console.log("📤 Avatar file selected:", file.name);

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const data = await apiFetch('/user/avatar', {
      method: 'POST',
      body: formData,
    });

    if (data?.avatarUrl) {
      console.log("✅ Avatar uploaded successfully. New URL:", `${API_BASE}${data.avatarUrl}`);
      setAvatarUrl(`${BASE_URL}${data.avatarUrl}`);
      await fetchUser();
    } else {
      alert(data?.message || 'Failed to upload avatar');
    }
  } catch (err) {
    console.error('❌ Upload error:', err);
    alert('Server error during avatar upload.');
  }
}, [fetchUser, BASE_URL]);
  
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
        name="avatar"
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

        {/* Icons */}
        <div className="mt-3 flex gap-4">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              console.log("🔔 Notifications clicked");
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
              console.log("📨 Navigating to messages...");
              navigate('/messages');
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
