import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <>
      <Navbar />
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
      </Routes>
    </>
  );
}

export default App;
