/**
 * Author: Brandon Trundle
 * File Name: Navbar.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays the main navigation bar for ArcanaTable.
 * Handles user authentication (login/logout), profile display, and navigation links.
 * 
 * Features:
 * - Displays site logo and brand name
 * - Navigation links for key pages (Play Now, Join, Marketplace, etc.)
 * - Login form embedded in dropdown
 * - Real-time user context updates (on login/logout)
 * - Displays user avatar if signed in
 * 
 * Props: None
 */

import React, { useState, useRef, useEffect, useContext, useCallback } from 'react'; // React core library and hooks
import { Bell } from 'lucide-react'; // Notification icon (placeholder for future notifications feature)
import { Link, useNavigate } from 'react-router-dom'; // Router hooks and components
import { UserContext } from '../context/UserContext'; // Global context for user authentication state
import { apiFetch, API_BASE } from '../utils/api'; // API utility functions


const BASE_URL = API_BASE.replace('/api', '');

/**
 * Navbar Component
 * 
 * Provides top-level navigation and authentication access for users.
 * 
 * Functionalities:
 * - Authenticated users see their avatar and a "Sign Out" button
 * - Unauthenticated users can open a login dropdown to sign in
 * - Navbar links allow quick navigation across major site sections
 * 
 * State:
 * - menuOpen (boolean): Whether login dropdown is open.
 * - email, password, error: Login form state management.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const { user, setUser, fetchUser } = useContext(UserContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

/**
 * Closes the login dropdown menu if a click occurs outside the menu.
 * 
 * @param {MouseEvent} event - The mouse click event.
 */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

/**
 * Handles user login process:
 * - Sends login credentials to backend.
 * - Saves token and user info to local storage.
 * - Updates user context.
 * - Redirects based on onboarding completion.
 * 
 * @param {Event} e - Form submit event.
 */
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    console.log("📨 Login attempt for email:", email);
  
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!data || data.message) {
        setError(data.message || 'Login failed');
        console.warn("❌ Login failed:", data.message);
        return;
      }
  
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Save user as well
      console.log("✅ Login successful, token stored");
  
      // Fetch fresh user context
      await fetchUser();
  
      // Redirect based on onboarding status
      if (data.user?.onboardingComplete) {
        console.log("📡 Redirecting to /user-welcome");
        navigate('/user-welcome');
      } else {
        console.log("📡 Redirecting to /welcome");
        navigate('/welcome');
      }
  
      setMenuOpen(false);
      setError('');
    } catch (err) {
      console.error("❌ Error during login:", err);
      setError('Server error during login');
    }
  }, [email, password, fetchUser, navigate]);

/**
 * Logs the user out:
 * - Clears token and user info from local storage.
 * - Resets user context.
 * - Redirects to homepage.
 */
  const handleLogout = useCallback(() => {
    console.log("📨 Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ✅ clear stored user too
    setUser(null);
    navigate('/');
  }, [navigate, setUser]);

  return (
    <nav className="bg-parchment border-b border-arcanabrown px-6 py-3 flex justify-between items-center shadow text-sm font-semibold text-arcanabrown">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <img src="arcanatable images/arcana-logo.png" alt="ArcanaTable Logo" className="h-10 w-auto" />
        <span className="text-2xl font-bold tracking-tight text-arcanadeep">ArcanaTable</span>
      </div>

      {/* Center: Nav Links */}
      <div className="hidden md:flex space-x-6 text-arcanared">
        <a href="#" className="hover:text-arcanabrown">Play Now</a>
        <a href="#" className="hover:text-arcanabrown">Join a Game</a>
        <button className="hover:text-arcanabrown">Marketplace ▾</button>
        <button className="hover:text-arcanabrown">Tools ▾</button>
        <button className="hover:text-arcanabrown">Community ▾</button>
        <a href="#" className="hover:text-arcanabrown">Subscribe</a>
      </div>

      {/* Right: Auth area */}
      <div className="flex items-center gap-3 text-arcanadeep relative" ref={menuRef}>
        <Bell className="w-5 h-5" />

        {user ? (
          <div className="flex items-center gap-2">
            <img
              src={user.avatarUrl ? `${BASE_URL}${user.avatarUrl}` : '/defaultav.png'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border object-cover"
            />
            <button onClick={handleLogout} className="hover:text-arcanared">
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => setMenuOpen(!menuOpen)} className="hover:text-arcanared">
              Sign In ▾
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 bg-white border border-arcanabrown shadow-md rounded-md w-72 p-4 z-50">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-arcanadeep">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-arcanared"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-arcanadeep">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-arcanared"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-arcanared text-white py-2 rounded hover:bg-arcanabrown transition"
                  >
                    Sign in
                  </button>

                  {error && <p className="text-sm text-arcanared text-center">{error}</p>}
                </form>

                {/* Footer Links */}
                <div className="text-sm mt-4 text-center">
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="text-arcanadeep hover:underline"
                  >
                    New to ArcanaTable? <span className="text-arcanared">Sign up</span>
                  </Link>
                  <br />
                  <button
                    type="button"
                    onClick={() => alert('Forgot password coming soon!')}
                    className="text-arcanadeep hover:underline mt-1 inline-block"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
