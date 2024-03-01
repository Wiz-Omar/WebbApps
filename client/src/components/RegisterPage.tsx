import React, { useState } from "react";
import axios from "axios";
import { AppDisplay } from "../App";

interface RegisterPageProps {
  setDisplay: (display: AppDisplay) => void;
}

function RegisterPage({ setDisplay }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:8080/user', {
        username,
        password,
      });

      // If the registration is successful
      if (response.status === 201) {
        alert(response.data.message); // User successfully created
        // Redirect to login page or directly to the TODO list, as needed
        setDisplay(AppDisplay.LOGIN_PAGE);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle different response statuses from your API
        if (error.response?.status === 409) {
          alert("User already exists");
        } else if (error.response?.status === 400) {
          alert("Invalid input data for username or password");
        } else {
          alert("An error occurred during registration. Please try again later.");
        }
      } else {
        // Handle non-Axios error
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
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
      <button onClick={registerUser}>Register</button>
    </div>
  );
}

export default RegisterPage;
