/**
 * Author: Brandon Trundle
 * File Name: CreateCampaign.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays a form for creating a new campaign, allowing the user to input campaign details and optionally upload an image.
 * 
 * Behavior:
 * - Collects form data for a new campaign.
 * - Handles optional image uploads using multipart/form-data.
 * - Sends a POST request to create the campaign on the server.
 * - Redirects to the campaigns list on success.
 * 
 * Props:
 * - None (page component using internal state).
 */

import React, { useState } from 'react'; // React library and hook for local state management
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import { apiFetch } from '../utils/api'; // Utility for sending server requests with authentication

/**
 * CreateCampaign Component
 * 
 * Renders a form for creating a new campaign, handling title, system, module, and optional image uploads.
 * 
 * @returns {JSX.Element} - The rendered campaign creation page
 */
const CreateCampaign = () => {
  const [form, setForm] = useState({
    title: '',
    system: '5E',
    module: '',
    image: null,  // Store the uploaded image here
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

/**
 * Updates form state when an input field changes.
 * 
 * @param {Event} e - Input change event
 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

/**
 * Updates form state with a selected image file.
 * 
 * @param {Event} e - File input change event
 */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
    }
  };
  
/**
 * Handles form submission to create a new campaign.
 * 
 * Behavior:
 * - Validates required fields.
 * - Packages form data as multipart/form-data.
 * - Sends POST request to the server.
 * - Navigates to campaign list page on success.
 * 
 * @param {Event} e - Form submit event
 * @throws {Error} - If server request fails
 */
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
