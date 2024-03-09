import axios from "axios";
import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onRegisterError: (error: string) => void;
}

const MIN_USERNAME_LENGTH = 8;
const MIN_PASSWORD_LENGTH = 8;
const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/; // Only alphanumeric characters allowed

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

  const validateUsername = (value: string) => {
    setUsername(value.trim()); // Trim the input value
    setUsernameError(""); // Reset the username error message
    if (value.trim().length < MIN_USERNAME_LENGTH) {
      setUsernameValid(false);
      setUsernameError(
        "Username must be at least " +
          MIN_USERNAME_LENGTH.toString() +
          " characters long"
      );
    } else if (!USERNAME_PATTERN.test(value)) {
      setUsernameValid(false);
      setUsernameError("Username must be alphanumeric");
    } else {
      setUsernameValid(true);
    }
  };

  const validatePassword = (value: string) => {
    setPassword(value); // Update the password state
    setPasswordError(""); // Reset the password error message
    if (value.trim().length < MIN_PASSWORD_LENGTH) {
      setPasswordValid(false);
      setPasswordError(
        "Password must be at least " +
          MIN_PASSWORD_LENGTH.toString() +
          " characters long"
      );
    } else {
      setPasswordValid(true);
    }
  };

  const registerUser = async () => {
    if (!usernameValid || !passwordValid) {
      onRegisterError("Please fix the errors in the form before submitting");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user", {
        username,
        password,
      });

      // If the registration is successful
      if (response.status === 201) {
        onRegisterSuccess(); // Invoke the success callback
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          onRegisterError("User already exists");
        } else if (error.response.status === 400) {
          onRegisterError("Invalid input data for username or password");
        } else {
          onRegisterError(
            "An error occurred during registration. Please try again later."
          );
        }
      } else {
        console.error("An unexpected error occurred:", error);
        onRegisterError("An unexpected error occurred");
      }
    }
  };

  return (
    <Form noValidate>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Username"
          aria-label="Username"
          value={username}
          onChange={(e) => validateUsername(e.target.value)}
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
          onChange={(e) => validatePassword(e.target.value)}
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
        <Button variant="primary" type="button" onClick={registerUser}>
          Register
        </Button>
      </div>
    </Form>
  );
};
