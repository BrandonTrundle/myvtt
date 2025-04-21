import React, { useEffect, useState } from 'react';
import UserInfoCard from '../components/UserInfoCard';

const UserWelcome = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log('👤 User from /api/auth/me:', data);

        if (res.ok) {
          setUser(data);
        } else {
          console.error('Failed to load user:', data.message);
        }
      } catch (err) {
        console.error('❌ Failed to fetch user', err);
      }
    };

    fetchUser();

    // Track play session
    const sessionStart = Date.now();

    const updatePlayTime = async () => {
      const sessionEnd = Date.now();
      const minutes = Math.floor((sessionEnd - sessionStart) / 60000);
      if (minutes <= 0) return;

      try {
        await fetch('http://localhost:5000/api/user/hours-played', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ minutes }),
        });
        console.log(`⏱️ Logged ${minutes} minutes`);
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
        <div className="bg-white p-6 rounded shadow border border-arcanabrown hover:shadow-lg transition">
          <h2 className="text-xl font-bold">⚔️ Create your first adventure</h2>
          <p className="mt-2">Start building your campaign map and invite your party.</p>
        </div>

        <div className="bg-white p-6 rounded shadow border border-arcanabrown hover:shadow-lg transition">
          <h2 className="text-xl font-bold">🧙 Create your character</h2>
          <p className="mt-2">Use our character builder to make your hero shine in your story.</p>
        </div>

        <div className="bg-white p-6 rounded shadow border border-arcanabrown hover:shadow-lg transition">
          <h2 className="text-xl font-bold">📖 Learn ArcanaTable</h2>
          <p className="mt-2">Explore tutorials on using tokens, fog of war, and map creation.</p>
        </div>
      </div>
    </div>
  );
};

export default UserWelcome;
