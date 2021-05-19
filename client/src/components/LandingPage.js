import { useEffect } from 'react';
import '../styles/LandingPage.css';
import { getCookieValue } from '../utils/utils';

function LandingPage() {
  useEffect(() => {
    const token = getCookieValue('w_auth');
    if (token !== '') window.location.href = '/submit';
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/user/login';
  };

  return (
    <div id='landing-wrapper'>
      <button id='login-btn' onClick={handleLogin}>
        42 Log In
      </button>
    </div>
  );
}

export default LandingPage;
