/**
 * Author: Brandon Trundle
 * File Name: Dashboard.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays a personalized dashboard welcome screen for authenticated users.
 * 
 * Behavior:
 * - Waits for user data to load from context.
 * - Greets the user by their display name or first name once available.
 * - Shows a loading message while user information is still loading.
 * 
 * Props:
 * - None (page component using internal context).
 */

import React, { useContext } from 'react'; // React library and hook for consuming context
import { UserContext } from '../context/UserContext'; // Context providing user authentication and profile data

/**
 * Dashboard Component
 * 
 * Renders a welcome message for authenticated users after login.
 * Displays a loading state while waiting for user data.
 * 
 * @returns {JSX.Element} - The rendered dashboard page
 */
const Dashboard = () => {
  const { user } = useContext(UserContext);
  
/**
 * Displays a loading message if user data is not yet available.
 */
  if (!user) {
    console.log("⏳ Waiting for user data...");
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-arcanabrown text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment text-arcanadeep flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">
        Welcome back, {user.displayName || user.firstName}!
      </h1>
      <p className="text-lg text-center max-w-xl">
        Your ArcanaTable adventures await. Use the top navigation to explore maps, tools, community, and more.
      </p>
    </div>
  );
};

export default Dashboard;
