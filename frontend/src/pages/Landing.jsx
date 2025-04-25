import React from 'react';

const Landing = () => {

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
