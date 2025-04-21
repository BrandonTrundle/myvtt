import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { user, setUser, fetchUser } = useContext(UserContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);

      // Set user in context
      await fetchUser();

      // Redirect based on onboarding status
      if (data.user?.onboardingComplete) {
        navigate('/user-welcome');
      } else {
        navigate('/welcome');
      }

      setMenuOpen(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Server error during login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-parchment border-b border-arcanabrown px-6 py-3 flex justify-between items-center shadow text-sm font-semibold text-arcanabrown">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <img src="/arcana-logo.png" alt="ArcanaTable Logo" className="h-10 w-auto" />
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
              src={user.avatarUrl ? `http://localhost:5000${user.avatarUrl}` : '/defaultav.png'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border object-cover"
            />
            <button
              onClick={handleLogout}
              className="hover:text-arcanared"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-arcanared"
            >
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
