/**
 * Author: Brandon Trundle
 * File Name: useFetchMap.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook for fetching the active campaign map from the server.
 * 
 * Behavior:
 * - Sends an authenticated request to retrieve the campaign's current active map.
 * - Updates local map URL state if a map is found.
 * - Gracefully handles cases where no active map exists.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect } from 'react'; // React hook for handling side effects
import axios from 'axios'; // HTTP client for making API requests

/**
 * useFetchMap Hook
 * 
 * Fetches the active campaign map from the server when campaignId changes.
 * Updates the provided map URL state if successful.
 * 
 * @param {string} campaignId - ID of the campaign to fetch the map for
 * @param {Function} setMapUrl - React state setter to update the map URL
 * @returns {void}
 */
export function useFetchMap(campaignId, setMapUrl) {
  /**
 * Triggers fetchMap when the component mounts or when campaignId changes.
 */
  useEffect(() => {

/**
 * Sends an authenticated GET request to retrieve campaign data.
 * 
 * Behavior:
 * - Extracts the activeMap field from server response.
 * - Sets the activeMap into local state.
 * - Logs a warning if no active map is found.
 * 
 * @throws {Error} - If network request fails
 */
    const fetchMap = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE}/campaigns/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.activeMap) {
          setMapUrl(res.data.activeMap); // ✅ use activeMap, not mapUrl
        } else {
          console.warn('🕳️ No active map found.');
        }
      } catch (err) {
        console.warn('❌ Error fetching map:', err);
      }
    };

    if (campaignId) fetchMap();
  }, [campaignId, setMapUrl]);
}
