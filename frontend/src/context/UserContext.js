import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api'; // adjust path if needed


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No token in localStorage');
      return;
    }
  
    console.log('📡 Fetching user info from:', '/api/auth/me');
    console.log('🔐 Using token:', token);
  
    try {
      const res = await apiFetch('/auth/me');
      const text = await res.text();
      console.log("📩 Raw user info:", text);
    
      const data = JSON.parse(text);
      if (res.ok) {
        setUser(data); // or use it however needed
      } else {
        console.warn("⚠️ Server returned error:", data);
      }
    } catch (err) {
      console.error("❌ Could not fetch user info:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
