import React, { useEffect } from 'react';
import axios from 'axios';
import { AppDisplay } from "../App";

interface StartPageProps {
    setDisplay: (display: AppDisplay) => void;
}

const StartPage = ( {setDisplay} : StartPageProps) => {

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/checkSession', { withCredentials: true });
        const { isAuthenticated, username } = response.data;

        if (isAuthenticated) {
          console.log(`User ${username} is already logged in.`);
          // Redirect or change state based on your application's needs
          setDisplay(AppDisplay.HOME_PAGE); // Example redirect
        }
      } catch (error) {
        console.error('Session check failed', error);
        // Handle error or stay on the current page
      }
    };

    checkSession();
  }, [setDisplay]);

  return (
    <div>
      <h1>Welcome to the start page</h1>
      <button onClick={() => setDisplay(AppDisplay.REGISTER_PAGE)}>
        Register
      </button>
      <button onClick={() => setDisplay(AppDisplay.LOGIN_PAGE)}>Login</button>
    </div>
  );
};

export default StartPage;
