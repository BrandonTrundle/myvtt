/**
 * Author: Brandon Trundle
 * File Name: UserWelcome.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays the onboarding welcome screen for newly registered ArcanaTable users.
 * 
 * Behavior:
 * - Shows the user info card with account details.
 * - Encourages users to create their first campaign or view existing ones.
 * - Tracks and updates hours played session data.
 * 
 * Props:
 * - None (page component using internal context and hooks).
 */

import React, { useEffect, useState, useContext } from 'react'; // React library and hooks for lifecycle, local state, and context access
import { useNavigate } from 'react-router-dom'; // Hook for programmatic route navigation
import UserInfoCard from '../components/UserInfoCard'; // Component displaying compact user information card
import { apiFetch } from '../utils/api'; // Utility for sending authenticated server requests
import { UserContext } from '../context/UserContext'; // Context providing user authentication and profile data

/**
 * UserWelcome Component
 * 
 * Renders the welcome screen post-signup or post-login, guiding users to create campaigns or characters.
 * Tracks session play time and updates it to the server.
 * 
 * @returns {JSX.Element} - The rendered welcome screen
 */
const UserWelcome = () => {
  const { user } = useContext(UserContext);
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

/**
 * Fetches user's campaigns and sets up session play time tracking.
 * 
 * Behavior:
 * - Fetches list of user's campaigns from the server on component mount.
 * - Adds event listeners to track and update minutes played on page unload.
 */
  useEffect(() => {
    const fetchCampaigns = async () => {
      console.log("📡 Fetching user's campaigns...");
      try {
        const data = await apiFetch('/campaigns/mine');
        setCampaigns(data);
        console.log("✅ Campaigns fetched:", data);
      } catch (err) {
        console.error('❌ Error fetching campaigns:', err);
      }
    };

    fetchCampaigns();

    // Track play session
    const sessionStart = Date.now();
    const updatePlayTime = async () => {
      const sessionEnd = Date.now();
      const minutes = Math.floor((sessionEnd - sessionStart) / 60000);
      if (minutes <= 0) return;

      console.log("📡 Updating play time:", minutes, "minutes");

      try {
        await apiFetch('/user/hours-played', {
          method: 'PATCH',
          body: JSON.stringify({ minutes }),
        });
      } catch (err) {
        console.error('❌ Failed to update play time', err);
      }
    };

    window.addEventListener('beforeunload', updatePlayTime);
    return () => {
      updatePlayTime();
      window.removeEventListener('beforeunload', updatePlayTime);
    };
  }, []);
  
/**
 * Displays a loading message while user data is being fetched.
 */
  if (!user) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center text-arcanabrown">
        <p>Loading your welcome screen...</p>
      </div>
    );
  }

  return (
    <div className="bg-parchment min-h-screen text-arcanadeep px-6 py-10 relative">
      {/* Top-right user info card */}
      <div className="absolute top-10 right-10">
        <UserInfoCard
          user={user}
          memberSince={user.createdAt}
          hoursPlayed={user.hoursPlayed || 0}
        />
      </div>

      {/* Welcome content */}
      <h1 className="text-4xl font-bold mb-2">Welcome to ArcanaTable!</h1>
      <p className="mb-8 text-lg">Let’s get you set up and ready to play.</p>

      <div className="grid gap-6 max-w-3xl">
        {campaigns.length === 0 ? (
          <div
            onClick={() => navigate('/create-campaign')}
            className="bg-white p-6 rounded shadow border border-arcanabrown hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-xl font-bold">⚔️ Create your first adventure</h2>
            <p className="mt-2">Start building your campaign map and invite your party.</p>
          </div>
        ) : (
          <div
            onClick={() => navigate('/campaigns')}
            className="bg-white p-6 rounded shadow border border-arcanabrown hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-xl font-bold">🎲 View your campaigns</h2>
            <p className="mt-2">Manage your active adventures and groups.</p>
          </div>
        )}

        {/* Character builder */}
        <div
          onClick={() => navigate('/characters')}
          className="bg-white p-6 rounded shadow border border-arcanabrown hover:shadow-lg transition cursor-pointer"
        >
          <h2 className="text-xl font-bold">🧙 Create your character</h2>
          <p className="mt-2">Use our character builder to make your hero shine in your story.</p>
        </div>

        {/* Learning resources */}
        <div className="bg-white p-6 rounded shadow border border-arcanabrown hover:shadow-lg transition">
          <h2 className="text-xl font-bold">📖 Learn ArcanaTable</h2>
          <p className="mt-2">Explore tutorials on using tokens, fog of war, and map creation.</p>
        </div>
      </div>
    </div>
  );
};

export default UserWelcome;
