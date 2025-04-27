/**
 * Author: Brandon Trundle
 * File Name: UserContext.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides global user authentication state management for ArcanaTable.
 * Handles user login state, user data retrieval, and exposes authentication helpers.
 * 
 * Behavior:
 * - Fetches user info from server on application mount.
 * - Tracks whether a user is authenticated and loading status.
 * - Provides user state, setter, and fetch function via context.
 * 
 * Props:
 * - None (internal context provider).
 */

import React, { createContext, useState, useEffect, useContext } from 'react'; // React imports for context, state management, lifecycle, and consumption
import { apiFetch } from '../utils/api'; // Utility function for making authenticated API requests

// Context object for providing user authentication and profile data
export const UserContext = createContext();

/**
 * UserProvider Component
 * 
 * Wraps the application and initializes user authentication state.
 * Fetches user data from server on mount and tracks authentication status.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Child components that need access to user data
 * @returns {JSX.Element} - Context provider wrapping the app
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

/**
 * Fetches current user information from the server.
 * 
 * Behavior:
 * - Checks for authentication token in localStorage.
 * - If token exists, retrieves user profile from /auth/me endpoint.
 * - Updates local user state accordingly.
 * 
 * @throws {Error} - If API call fails or token is invalid
 */
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No token in localStorage');
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiFetch('/auth/me');
      if (!data || data.message) {
        console.warn("⚠️ Failed to fetch user info:", data.message);
        setUser(null);
      } else {
        console.log("✅ User data fetched successfully:", data);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      console.error("❌ Could not fetch user info:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

/**
 * useEffect hook
 * 
 * Fetches user info once when the UserProvider mounts.
 */  
  useEffect(() => {
    console.log('📡 Fetching user info on component mount...');
    fetchUser();
  }, []);

/**
 * Indicates whether a user is currently authenticated.
 * 
 * @type {boolean}
 */
  const isAuthenticated = !!user;

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, isAuthenticated, isLoading }}>
      {isLoading ? <div>Loading user...</div> : children}
    </UserContext.Provider>
  );
};

/**
 * useUser Hook
 * 
 * Provides access to the UserContext, exposing user data and authentication helpers.
 * 
 * @returns {Object} - { user, setUser, fetchUser, isAuthenticated, isLoading }
 * @throws {Error} - If used outside of a UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
