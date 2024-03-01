import React, { useState } from "react";
import axios from "axios";
import { AppDisplay } from "../App";

axios.defaults.withCredentials = true

interface LoginPageProps {
  setDisplay: (display: AppDisplay) => void;
}

function LoginPage({ setDisplay }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:8080/user/login', {
        username,
        password,
      });

      // If the login is successful
      if (response.status === 200) {
        console.log(response.data.message); // User successfully logged in
        // Here, you can update the state or redirect the user as needed
        setDisplay(AppDisplay.HOME_PAGE);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle different response statuses from your API
        if (error.response?.status === 401) {
          alert("Invalid username or password");
        } else if (error.response?.status === 400) {
          alert("Invalid input data for username or password");
        } else {
          alert("An error occurred. Please try again later.");
        }
      } else {
        // Handle non-Axios error
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => setDisplay(AppDisplay.START_PAGE)}>Go back</button>
      <button onClick={loginUser}>Login</button>
    </div>
  );
}

export default LoginPage;
