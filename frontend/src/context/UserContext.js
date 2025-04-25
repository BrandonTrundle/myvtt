import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '../utils/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    console.log('📡 Fetching user info on component mount...');
    fetchUser();
  }, []);

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, isAuthenticated, isLoading }}>
      {isLoading ? <div>Loading user...</div> : children}
    </UserContext.Provider>
  );
};

// ✅ Add this custom hook for clean usage
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
