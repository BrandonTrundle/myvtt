import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const CreateCampaign = () => {
  const [form, setForm] = useState({
    title: '',
    system: '5E',
    module: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.system) {
      setMessage('Please fill in the required fields.');
      return;
    }

    try {
      const res = await apiFetch('/campaigns', {
        method: 'POST',
        body: JSON.stringify(form),
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
        navigate('/campaigns'); // or to `/campaigns/${data._id}` if you build that later
      } else {
        setMessage(data.message || 'Error creating campaign.');
      }
    } catch (err) {
      console.error('❌ Create error:', err);
      setMessage('Server error.');
    }
  };

  return (
    <div className="bg-parchment min-h-screen px-6 py-10 text-arcanadeep">
      <h1 className="text-3xl font-bold mb-6">🛠️ Create a New Campaign</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6 bg-white p-6 border border-arcanabrown rounded shadow">
        <div>
          <label className="block font-medium mb-1">Campaign Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">System *</label>
          <select
            name="system"
            value={form.system}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="5E">D&D 5E</option>
            <option value="Pathfinder">Pathfinder</option>
            <option value="Call of Cthulhu">Call of Cthulhu</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Module (Optional)</label>
          <input
            type="text"
            name="module"
            value={form.module}
            onChange={handleChange}
            placeholder="e.g. Lost Mines of Phandelver"
            className="w-full border p-2 rounded"
          />
        </div>

        <button type="submit" className="bg-arcanared text-white px-4 py-2 rounded hover:bg-arcanabrown transition">
          Create Campaign
        </button>

        {message && <p className="text-arcanared mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default CreateCampaign;
