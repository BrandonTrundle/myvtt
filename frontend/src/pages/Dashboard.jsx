import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api'; // adjust path if needed


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch('/user/me');


        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text); // ✅ Only try if it's real JSON
        } catch (err) {
          console.warn("⚠️ Could not parse JSON. Response was:", text);
          return; // Or handle fallback logic here
        }
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-arcanabrown text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment text-arcanadeep flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome back, {user.displayName || user.firstName}!</h1>
      <p className="text-lg text-center max-w-xl">
        Your ArcanaTable adventures await. Use the top navigation to explore maps, tools, community, and more.
      </p>
    </div>
  );
};

export default Dashboard;
