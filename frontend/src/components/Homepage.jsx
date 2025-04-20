import React from 'react';

const Homepage = () => {
  return (
    <div className="bg-parchment text-arcanabrown">

      {/* Hero */}
      <section className="bg-parchment py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Your Virtual Tabletop Adventure Starts Here</h1>
        <p className="text-xl mb-8">Create. Collaborate. Conquer. All in your browser.</p>
        <button className="bg-arcanared text-white px-8 py-3 rounded-lg hover:bg-arcanabrown transition">
          Get Started Free
        </button>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Drag & Drop", icon: "🧙", desc: "Add characters and NPCs to your maps instantly." },
            { title: "Dynamic Lighting", icon: "💡", desc: "Reveal only what players can see." },
            { title: "Custom Maps", icon: "🗺️", desc: "Upload or create maps for your world." },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-arcanadeep">{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-20 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">What is ArcanaTable?</h2>
          <p className="text-lg leading-relaxed text-arcanabrown">
            ArcanaTable is your ultimate online destination for tabletop RPGs. 
            Play with friends, craft adventures, and immerse yourself in the magic of collaborative storytelling.
          </p>
        </div>
      </section>

      {/* Preview / Screenshot */}
      <section className="py-20 bg-yellow-200 text-center px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Map Preview</h2>
          <div className="rounded-lg border-4 border-dashed border-arcanabrown h-64 flex items-center justify-center">
            <span className="text-arcanabrown text-xl">[ Map Screenshot Placeholder ]</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-arcanared text-white py-16 text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
        <p className="mb-6">Sign up now and bring your next session to life.</p>
        <button className="bg-white text-arcanared font-semibold px-6 py-3 rounded-lg hover:bg-yellow-100 transition">
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-arcanadeep text-yellow-100 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} ArcanaTable. All rights reserved.</p>
        <div className="mt-2 text-sm">
          <a href="#" className="hover:underline px-2">Privacy Policy</a>|
          <a href="#" className="hover:underline px-2">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
