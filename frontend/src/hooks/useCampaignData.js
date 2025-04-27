/**
 * Author: Brandon Trundle
 * File Name: useCampaignData.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook to fetch and manage campaign data based on a given campaign ID.
 * 
 * Behavior:
 * - On mount or when campaignId changes, fetches campaign data from the server.
 * - Automatically parses response safely and updates local campaign state.
 * - Handles invalid or non-JSON server responses gracefully.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect } from 'react'; // React hook for handling side effects

/**
 * useCampaignData Hook
 * 
 * Fetches campaign data from the server whenever campaignId changes.
 * Updates the local state via the provided setCampaign setter function.
 * 
 * @param {string} campaignId - ID of the campaign to load
 * @param {Function} setCampaign - React state setter function to store campaign data
 * @returns {void}
 */
export function useCampaignData(campaignId, setCampaign) {
 /**
 * Triggers fetchCampaign when the component mounts or campaignId changes.
 */
  useEffect(() => {

/**
 * Fetches campaign details from the backend API.
 * 
 * Behavior:
 * - Sends authenticated GET request to /campaigns/:campaignId.
 * - Parses and validates the response.
 * - Updates campaign state if successful, or logs errors otherwise.
 * 
 * @throws {Error} - If network request fails or server returns invalid data
 */
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error('❌ Failed to fetch campaign');
          return;
        }

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text); // ✅ Only try if it's real JSON
        } catch (err) {
          console.warn("⚠️ Could not parse JSON. Response was:", text);
          return; // Or handle fallback logic here
        }
        setCampaign(data);
      } catch (err) {
        console.error('❌ Error loading campaign:', err);
      }
    };

    if (campaignId) fetchCampaign();
  }, [campaignId, setCampaign]);
}
