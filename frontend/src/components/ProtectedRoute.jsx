/**
 * Author: Brandon Trundle
 * File Name: ProtectedRoute.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Guards private routes by checking user authentication and onboarding status.
 * 
 * Behavior:
 * - Redirects unauthenticated users to homepage (/).
 * - Redirects users without completed onboarding to /welcome.
 * - Redirects onboarded users away from /welcome to /user-welcome.
 * - Renders protected children if checks pass.
 * 
 * Props:
 * - children (ReactNode): The protected component(s) to render if authorized.
 */

import React, { useContext } from 'react'; // React core library and hooks
import { Navigate, useLocation } from 'react-router-dom'; // Router components for redirects
import { UserContext } from '../context/UserContext'; // Global user context provider

/**
 * ProtectedRoute Component
 * 
 * Guards application routes based on:
 * - Token presence in localStorage
 * - User context loading status
 * - User onboarding completion status
 * 
 * Redirects based on authentication or onboarding state, otherwise renders child components.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components intended to be protected.
 * 
 * @returns {JSX.Element} Either a redirect, a loading indicator, or the protected content.
 */
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
