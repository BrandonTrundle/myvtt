/**
 * Author: Brandon Trundle
 * File Name: OnboardingRedirect.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * A wrapper component that checks if the authenticated user has completed onboarding.
 * 
 * If the user has not completed onboarding, redirects them to the /welcome page.
 * Otherwise, renders the wrapped child components.
 * 
 * Props:
 * - children (ReactNode): Components to render if onboarding is complete.
 */
import { useContext, useEffect } from 'react'; // React hooks for context and side-effects
import { useNavigate } from 'react-router-dom'; // Navigation hook for programmatic redirects
import { UserContext } from '../../context/UserContext'; // Global user authentication context

/**
 * OnboardingRedirect Component
 * 
 * Guards routes that require users to have completed onboarding.
 * 
 * Behavior:
 * - If user is logged in and onboarding is incomplete ➔ redirect to /welcome.
 * - If user is logged in and onboarding is complete ➔ allow access to children.
 * - If no user context is present ➔ allow access to children (assumes public route or handled elsewhere).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elements to render if allowed.
 * 
 * @returns {JSX.Element} Rendered children or triggers navigation.
 */
const OnboardingRedirect = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📨 Checking user onboarding status...");
    if (user && !user.onboardingComplete) {
      console.log("❌ User onboarding not complete, redirecting to /welcome");
      navigate('/welcome');
    } else {
      console.log("✅ User onboarding complete or no user found.");
    }
  }, [user, navigate]);

  return children;
};

export default OnboardingRedirect;
