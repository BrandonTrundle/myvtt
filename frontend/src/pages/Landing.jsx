/**
 * Author: Brandon Trundle
 * File Name: Landing.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Basic promotional landing page introducing ArcanaTable to new visitors.
 * 
 * Behavior:
 * - Displays a simple hero section with a call-to-action button.
 * - Logs user interaction when the "Get Started Free" button is clicked.
 * 
 * Props:
 * - None (page component using internal handlers).
 */

import React from 'react'; // React library for building the component

/**
 * Landing Component
 * 
 * Renders the minimal public-facing landing page for ArcanaTable.
 * Provides a basic introduction and call-to-action to start using the platform.
 * 
 * @returns {JSX.Element} - The rendered landing page layout
 */
const Landing = () => {
  
/**
 * Handles user click on the "Get Started Free" button.
 * 
 * Behavior:
 * - Logs an interaction event for analytics or debugging purposes.
 */
  const handleGetStartedClick = () => {
    console.log("📨 User clicked 'Get Started Free'");
  };

  return (
    <div className="bg-parchment text-arcanabrown min-h-screen">
      {/* Navbar Placeholder */}
      <header className="border-b border-arcanabrown py-4 px-6">
        <h1 className="text-2xl font-bold text-arcanadeep">ArcanaTable</h1>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-white">
        <h2 className="text-5xl font-extrabold mb-6">
          Your Next TTRPG Session Starts Here
        </h2>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          Play online with friends, build custom maps, and create immersive campaigns – all in your browser.
        </p>
        <button
          className="bg-arcanared text-white font-semibold px-6 py-3 rounded-lg hover:bg-arcanabrown transition"
          onClick={handleGetStartedClick}
        >
          Get Started Free
        </button>
      </section>
    </div>
  );
};

export default Landing;
