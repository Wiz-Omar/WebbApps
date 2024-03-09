import axios from "axios";
import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import {
  validatePassword,
  validateUsername,
} from "../../utils/validateCredentials";
import { registerUser } from "../../utils/registerUser";
import "./LoginPage.css";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onRegisterError: (error: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onRegisterError,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Call validation functions separately after state update
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    const error = validateUsername(newUsername);
    setUsernameError(error);
    setUsernameValid(!error);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const error = validatePassword(newPassword);
    setPasswordError(error);
    setPasswordValid(!error);
  };

  const handleRegister = async () => {
    if (usernameError || passwordError || !usernameValid || !passwordValid) {
      const errorMessage = usernameError || passwordError || "Please fill in all fields.";
      onRegisterError(errorMessage);
      return;
    }
  
    try {
      const response = await registerUser(username, password);
      // Assuming a successful response includes specific data indicating success
      if (response.status === 201) {
        onRegisterSuccess();
      } else {
        onRegisterError("Registration was successful, but an unexpected response was received. Please verify your account status.");
      }
    } catch (error: any) {
      let errorMsg = "An unexpected error occurred during registration. Please try again later.";
  
      if (axios.isAxiosError(error)) {
        // You can handle specific status codes here
        switch (error.response?.status) {
          case 400:
            errorMsg = "Invalid request. Please ensure all fields are filled out correctly.";
            break;
          case 409:
            errorMsg = "An account with this username already exists.";
            break;
          case 500:
            errorMsg = "A server error occurred. Please try again later.";
            break;
          // Add more cases as needed
          default:
            // Leave errorMsg as the default message for unexpected status codes
            break;
        }
      }
      onRegisterError(errorMsg);
    }
  };  

  return (
    <Form noValidate>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Username"
          aria-label="Username"
          value={username}
          onChange={handleUsernameChange}
          isInvalid={!!usernameError}
        />
        <Form.Control.Feedback type="invalid">
          {usernameError}
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup className="mb-4">
        <FormControl
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={handlePasswordChange}
          isInvalid={!!passwordError}
        />
        <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
          {showPassword ? <EyeSlashFill /> : <EyeFill />}
        </InputGroup.Text>
        <Form.Control.Feedback type="invalid">
          {passwordError}
        </Form.Control.Feedback>
      </InputGroup>
      <div className="d-grid gap-2">
        <Button variant="primary" type="button" onClick={handleRegister}>
          Register
        </Button>
      </div>
    </Form>
  );
};
