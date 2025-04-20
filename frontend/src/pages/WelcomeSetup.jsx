import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.onboardingComplete) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking onboarding status', err);
      }
    };
    checkOnboarding();
  }, [token, navigate]);

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
      const res = await fetch('http://localhost:5000/api/auth/onboarding', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, onboardingComplete: true }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/dashboard');
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