import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import { EyeSlashFill, EyeFill } from "react-bootstrap-icons"; // Make sure to import EyeFill as well
import { performLogin } from "../../utils/loginUser";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onLoginError: (error: string) => void;
}

/**
 * Provides a user interface for logging in, featuring a form with username and password fields. 
 * Includes a toggle for showing or hiding the password. On form submission, it executes the `performLogin` 
 * utility function with the provided credentials and callback functions for handling the outcomes.
 * Utilizes React Bootstrap for styling, with icons for toggling password visibility.
 *
 * Props:
 * - `onLoginSuccess: () => void` - Callback executed upon successful login.
 * - `onLoginError: (error: string) => void` - Callback executed upon a login error, receiving error message.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onLoginError,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performLogin({ username, password, onLoginSuccess, onLoginError });
  };

  return (
    <Form onSubmit={loginUser}>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Username"
          aria-label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </InputGroup>
      <InputGroup className="mb-4">
        <FormControl
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputGroup.Text onClick={() => setPasswordVisible(!passwordVisible)} style={{ cursor: "pointer" }}>
          {passwordVisible ? <EyeSlashFill /> : <EyeFill />}
        </InputGroup.Text>
      </InputGroup>
      <div className="d-grid gap-2">
        <Button variant="primary" type="submit">
          Log In
        </Button>
      </div>
    </Form>
  );
};
