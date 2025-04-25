import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

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
