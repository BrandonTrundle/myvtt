import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');
  const location = useLocation();

  console.log("📨 ProtectedRoute check - Current path:", location.pathname);

  // Not logged in
  if (!token) {
    console.log("❌ User not logged in, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // Still waiting on user fetch
  if (user === null) {
    console.log("⌛ Waiting for user data...");
    return <div>Loading...</div>;
  }

  // User is logged in but not onboarded, and is trying to access protected stuff
  if (!user.onboardingComplete && location.pathname !== '/welcome') {
    console.log("❌ User not onboarded, redirecting to /welcome");
    return <Navigate to="/welcome" replace />;
  }

  // Onboarded user trying to access onboarding again
  if (user.onboardingComplete && location.pathname === '/welcome') {
    console.log("❌ Onboarded user trying to access /welcome, redirecting to /user-welcome");
    return <Navigate to="/user-welcome" replace />;
  }

  console.log("✅ User is authorized, rendering protected content.");
  return children;
};

export default ProtectedRoute;
