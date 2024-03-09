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

/**
 * A component for rendering and handling a registration form where new users can create an account.
 * It includes input fields for username and password, along with validation for both. Upon submitting
 * the form with valid credentials, it attempts to register the user using a provided registration utility.
 * If the registration is successful, a success callback is triggered. If there's an error (e.g., username
 * already exists, validation fails), an error callback is called with an appropriate message.
 *
 * Props:
 *  - onRegisterSuccess: Function - A callback function that is called upon successful registration of the user.
 *  - onRegisterError: Function - A callback function that is called with an error message if the registration fails
 *    or if there are validation errors.
 */
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

  // Attempt to register the user using the provided utility function
  const handleRegister = async () => {
    if (usernameError || passwordError || !usernameValid || !passwordValid) {
      const errorMessage =
        usernameError || passwordError || "Please fill in all fields.";
      onRegisterError(errorMessage);
      return;
    }

    // Call the registration utility function
    await registerUser({
      username,
      password,
      onRegisterSuccess: onRegisterSuccess,
      onRegisterError: onRegisterError,
    });
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
        <InputGroup.Text
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: "pointer" }}
        >
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
