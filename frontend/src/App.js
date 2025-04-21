import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Signup from './pages/Signup';
import WelcomeSetup from './pages/WelcomeSetup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Add this line
import UserWelcome from './pages/UserWelcome';


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


        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              <UserWelcome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
