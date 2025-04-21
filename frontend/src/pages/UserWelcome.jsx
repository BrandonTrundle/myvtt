import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoCard from '../components/UserInfoCard';
import { apiFetch } from '../utils/api';

const UserWelcome = () => {
  const [user, setUser] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch('/api/auth/me');
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error('❌ Failed to fetch user', err);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const res = await apiFetch('/api/campaigns/mine');
        const data = await res.json();
        if (res.ok) setCampaigns(data);
      } catch (err) {
        console.error('❌ Error fetching campaigns:', err);
      }
    };

    fetchUser();
    fetchCampaigns();

    // Track play session
    const sessionStart = Date.now();
    const updatePlayTime = async () => {
      const sessionEnd = Date.now();
      const minutes = Math.floor((sessionEnd - sessionStart) / 60000);
      if (minutes <= 0) return;

      try {
        await apiFetch('/api/user/hours-played', {
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
        {/* Campaigns box (dynamic based on campaign count) */}
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
