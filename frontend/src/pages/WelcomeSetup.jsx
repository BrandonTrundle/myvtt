import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { UserContext } from '../context/UserContext'; // ✅ hook into user context

const WelcomeSetup = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    displayName: '',
    language: 'English',
    experienceLevel: '',
    role: '',
    groupType: '',
    playPreferences: [],
  });

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // ✅ pull from context

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await apiFetch('/auth/me');
        const text = await res.text();
        console.log("📩 Raw user info:", text);

        const data = JSON.parse(text);
        if (res.ok) {
          setUser(data); // ✅ now valid
        } else {
          console.warn("⚠️ Server returned error:", data);
        }
      } catch (err) {
        console.error("❌ Could not fetch user info:", err);
      }
    };
    checkOnboarding();
  }, [navigate, setUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => {
        const selected = new Set(prev.playPreferences);
        checked ? selected.add(value) : selected.delete(value);
        return { ...prev, playPreferences: Array.from(selected) };
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const res = await apiFetch('/auth/onboarding', {
        method: 'PATCH',
        body: JSON.stringify({ ...form, onboardingComplete: true }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text); // ✅ Only try if it's real JSON
      } catch (err) {
        console.warn("⚠️ Could not parse JSON. Response was:", text);
        return; // Or handle fallback logic here
      }
      if (res.ok) {
        navigate('/user-welcome');
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      alert('Server error.');
    }
  };

  const StepDisplay = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Welcome to ArcanaTable</h2>
            <p className="mb-6">Let’s get your account set up.</p>
            <button onClick={nextStep} className="bg-arcanared text-white px-4 py-2 rounded">Next</button>
          </>
        );
      case 1:
        return (
          <>
            <label className="block mb-2 font-medium">Display Name</label>
            <input name="displayName" value={form.displayName} onChange={handleChange} className="border px-3 py-2 w-full rounded" />
            <label className="block mt-4 mb-2 font-medium">Language</label>
            <select name="language" value={form.language} onChange={handleChange} className="border px-3 py-2 w-full rounded">
              <option>English</option>
              <option>German</option>
              <option>Spanish</option>
            </select>
            <div className="mt-6 flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <label className="block mb-2 font-medium">Your TTRPG Experience Level</label>
            <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="border px-3 py-2 w-full rounded">
              <option value="">Select...</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <div className="mt-6 flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <label className="block mb-2 font-medium">What kind of player are you?</label>
            <select name="role" value={form.role} onChange={handleChange} className="border px-3 py-2 w-full rounded">
              <option value="">Select...</option>
              <option>Player</option>
              <option>GM</option>
              <option>Both</option>
            </select>
            <div className="mt-6 flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <label className="block mb-2 font-medium">What best describes your group?</label>
            <select name="groupType" value={form.groupType} onChange={handleChange} className="border px-3 py-2 w-full rounded">
              <option value="">Select...</option>
              <option>Online-only</option>
              <option>Friends</option>
              <option>Looking for Group</option>
              <option>Mixed</option>
              <option>Local Meetup</option>
            </select>
            <div className="mt-6 flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <label className="block mb-2 font-medium">What do you enjoy most?</label>
            <div className="flex flex-col gap-2">
              {['Roleplay', 'Combat', 'Puzzles', 'Exploration', 'Storytelling'].map((pref) => (
                <label key={pref}>
                  <input
                    type="checkbox"
                    name="playPreferences"
                    value={pref}
                    checked={form.playPreferences.includes(pref)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {pref}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button onClick={handleSubmit} className="bg-arcanared text-white px-4 py-2 rounded">Finish</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-parchment min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded shadow border border-arcanabrown">
        {StepDisplay()}
      </div>
    </div>
  );
};

export default WelcomeSetup;
