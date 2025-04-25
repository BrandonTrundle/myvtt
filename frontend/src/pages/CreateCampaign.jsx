import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const CreateCampaign = () => {
  const [form, setForm] = useState({
    title: '',
    system: '5E',
    module: '',
    image: null,  // Store the uploaded image here
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📡 Submitting form with data:", form);
  
    if (!form.title || !form.system) {
      setMessage('Please fill in the required fields.');
      console.warn('⚠️ Missing required fields.');
      return;
    }
  
    const campaignData = new FormData();
    campaignData.append('title', form.title);
    campaignData.append('system', form.system);
    campaignData.append('module', form.module);
  
    // Append the image if selected
    if (form.image) {
      campaignData.append('image', form.image);
    }

    try {
      const data = await apiFetch('/campaigns', {
        method: 'POST',
        body: campaignData,
      });
  
      console.log("✅ Campaign created successfully:", data);
      navigate('/campaigns');
    } catch (err) {
      console.error('❌ Create error:', err);
      setMessage(err.message || 'Server error.');
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

        {/* Image Upload Section */}
        <div>
          <label className="block font-medium mb-1">Campaign Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Display default image */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">Default Image Preview:</h3>
          <img
            src={form.image ? URL.createObjectURL(form.image) : '/default images/default-campaign.jpg'}
            alt="Default Campaign"
            className="w-full h-40 object-cover rounded mt-2"
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
