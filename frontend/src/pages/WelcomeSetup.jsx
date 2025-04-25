import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { UserContext } from '../context/UserContext';

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
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const checkOnboarding = async () => {
      console.log("📡 Checking user onboarding status...");
      try {
        const data = await apiFetch('/auth/me');
        if (data) {
          setUser(data);
          console.log("✅ User data fetched:", data);
        }
      } catch (err) {
        console.error("❌ Could not fetch user info:", err);
      }
    };

    checkOnboarding();
  }, [setUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => {
        const updated = new Set(prev.playPreferences);
        checked ? updated.add(value) : updated.delete(value);
        return { ...prev, playPreferences: Array.from(updated) };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    console.log("📡 Submitting onboarding data:", form);
    try {
      const result = await apiFetch('/auth/onboarding', {
        method: 'PATCH',
        body: JSON.stringify({ ...form, onboardingComplete: true }),
      });

      if (result && !result.message) {
        console.log("✅ Onboarding complete, navigating to /user-welcome");
        navigate('/user-welcome');
      } else {
        console.warn("⚠️ Server returned error:", result?.message);
        alert(result?.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error("❌ Server error during onboarding submission:", err);
      alert('Server error.');
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const StepDisplay = () => {
    console.log(`📄 Displaying step ${step}`);
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
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
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
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
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
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
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
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <label className="block mb-2 font-medium">What do you enjoy most?</label>
            <div className="flex flex-col gap-2">
              {['Roleplay', 'Combat', 'Puzzles', 'Exploration', 'Storytelling'].map((pref) => (
                <label key={pref} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="playPreferences"
                    value={pref}
                    checked={form.playPreferences.includes(pref)}
                    onChange={handleChange}
                  />
                  {pref}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={handleSubmit} className="bg-arcanared text-white px-4 py-2 rounded">
                Finish
              </button>
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
