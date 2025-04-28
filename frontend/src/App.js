/**
 * Author: Brandon Trundle
 * File Name: App.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Main application component for ArcanaTable, managing top-level routing and layout.
 * 
 * Behavior:
 * - Initializes protected and public routes.
 * - Displays a loading screen while user context is initializing.
 * - Wraps the app inside a WebSocket provider.
 * - Hides the navbar when inside the tabletop interface.
 * 
 * Props:
 * - None (root component using hooks and context).
 */

import React, { useContext } from 'react'; // React library and hooks for context access
import { Routes, Route, useLocation } from 'react-router-dom'; // Routing components for client-side navigation
import Navbar from './components/PageComponents/Navigation/Navbar'; // Navigation bar for main app layout
import Homepage from './pages/Homepage'; // Public homepage component
import Signup from './pages/Signup'; // User signup form page
import WelcomeSetup from './pages/WelcomeSetup'; // User onboarding setup wizard
import Dashboard from './pages/Dashboard'; // Authenticated user dashboard
import Landing from './pages/Landing'; // Basic promotional landing page
import ProtectedRoute from './components/ProtectedRoute'; // Wrapper component to protect private routes
import UserWelcome from './pages/UserWelcome'; // Post-onboarding welcome page
import CharacterDashboard from './pages/CharacterDashboard'; // User's character management dashboard
import CreateCampaign from './pages/CreateCampaign'; // Page to create new campaigns
import CampaignList from './pages/CampaignList'; // User's campaign list page
import Messages from './pages/Messages'; // User's inbox and messaging center
import Tabletop from './components/GameBoard/Tabletop'; // Main virtual tabletop view
import { SocketProvider } from './context/SocketContext'; // WebSocket connection provider for real-time features
import { UserContext } from './context/UserContext'; // Context providing user authentication and loading state

/**
 * App Component
 * 
 * Manages global routing, loading screen, WebSocket context, and layout logic.
 * 
 * Behavior:
 * - Shows a loading message while user context is loading.
 * - Hides the navigation bar when inside the tabletop view.
 * - Renders all public and private application routes inside a SocketProvider.
 * 
 * @returns {JSX.Element} - The rendered ArcanaTable application
 */
function App() {
  const location = useLocation();
  const isTabletop = location.pathname.startsWith('/table/');
  const { isLoading } = useContext(UserContext);

/**
 * Displays a loading screen while the user context is being initialized.
 */
  if (isLoading) {
    console.log("🕒 Waiting for user context...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment text-arcanabrown">
        Loading user...
      </div>
    );
  }

  console.log("✅ User context ready. Rendering routes...");
  
/**
 * Defines the public, onboarding, and protected application routes.
 * 
 * Behavior:
 * - Public routes are accessible without authentication.
 * - Protected routes require user authentication and are wrapped in <ProtectedRoute>.
 * - SocketProvider ensures WebSocket connection is available throughout app.
 */
  return (
    <SocketProvider>
      {!isTabletop && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<Landing />} />

        {/* Onboarding Routes */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomeSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-welcome"
          element={
            <ProtectedRoute>
              <UserWelcome />
            </ProtectedRoute>
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters"
          element={
            <ProtectedRoute>
              <CharacterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <CampaignList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
          <Route path="/table/:campaignId" element={<Tabletop />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
