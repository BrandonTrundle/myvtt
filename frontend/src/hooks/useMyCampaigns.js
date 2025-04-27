/**
 * Author: Brandon Trundle
 * File Name: useMyCampaigns.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Custom React hook for retrieving and managing the campaigns owned or joined by the current user.
 * 
 * Behavior:
 * - Fetches user's campaigns from the server on mount.
 * - Flags each campaign with whether the user is the GM.
 * - Tracks loading state during asynchronous fetch operations.
 * 
 * Props:
 * - None (hook parameters instead).
 */

import { useEffect, useState, useContext } from 'react'; // React hooks for side effects, state management, and context access
import { apiFetch } from '../utils/api'; // API utility for making authenticated server requests
import { UserContext } from '../context/UserContext'; // Context for accessing the currently logged-in user's information

/**
 * useMyCampaigns Hook
 * 
 * Fetches campaigns the user is part of and identifies if the user is the GM for each.
 * 
 * @returns {Object} - { campaigns, setCampaigns, fetchCampaigns, loading }
 */
export function useMyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

/**
 * Fetches the list of campaigns belonging to the user.
 * 
 * Behavior:
 * - Sends a GET request to /campaigns/mine.
 * - Adds an isGM flag based on whether the current user is the campaign's GM.
 * - Updates local campaigns state with the modified data.
 * 
 * @throws {Error} - If network request fails
 */
  const fetchCampaigns = async () => {
    try {
      const data = await apiFetch('/campaigns/mine');

      // Inject isGM based on match with logged-in user
      const withFlags = data.map(camp => ({
        ...camp,
        isGM: user && camp.gm === user._id
      }));

      setCampaigns(withFlags);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
/**
 * Fetches campaigns once when the hook is initialized.
 */
  useEffect(() => {
    fetchCampaigns();
  }, []);

  return { campaigns, setCampaigns, fetchCampaigns, loading };
}
