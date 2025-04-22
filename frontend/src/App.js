import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Signup from './pages/Signup';
import WelcomeSetup from './pages/WelcomeSetup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import UserWelcome from './pages/UserWelcome';
import CharacterDashboard from './pages/CharacterDashboard';
import CreateCampaign from './pages/CreateCampaign';
import CampaignList from './pages/CampaignList';
import Messages from './pages/Messages';
import Tabletop from './components/Tabletop';
import { SocketProvider } from './context/SocketContext';

function App() {
  const location = useLocation();
  const isTabletop = location.pathname.startsWith('/table/');

  return (
    <SocketProvider>
      {!isTabletop && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<WelcomeSetup />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/user-welcome" element={<UserWelcome />} />

        {/* Protected Routes */}
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

        {/* Tabletop Route */}
        <Route
          path="/table/:campaignId"
          element={
            <ProtectedRoute>
              <Tabletop />
            </ProtectedRoute>
          }
        />
      </Routes>
    </SocketProvider>
  );
}

export default App;