import React, { useState } from "react";
import axios from "axios";
import { AppDisplay } from "../App";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "./LoginPage.css"; // Reuse styles from LoginPage

import logo from "../assets/img/squid.png";

axios.defaults.withCredentials = true;

interface RegisterPageProps {
  setDisplay: (display: AppDisplay) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setDisplay }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false); // assume invalid by default
  const [passwordValid, setPasswordValid] = useState(false); // assume invalid by default

  const validateUsername = (value: string) => {
    setUsername(value.trim()); // Trim the input value
    setUsernameError(""); // Reset the username error message
    if (value.trim().length < 6) {
      setUsernameValid(false);
      setUsernameError("Username must be at least 6 characters long");
    } else if (!/^[a-zA-Z0-9]{1,25}$/.test(value)) {
      setUsernameValid(false);
      setUsernameError(
        "Username must be alphanumeric and less than 25 characters"
      );
    } else {
      setUsernameValid(true);
    }
  };

  const validatePassword = (value: string) => {
    setPassword(value); // Update the password state
    setPasswordError(""); // Reset the password error message
    if (value.trim().length === 0) {
      // If the field is empty, mark it as invalid but don't display the error message
      setPasswordValid(false);
    } else {
      // Perform validation only if the field is not empty
      const isValid =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/.test(
          value
        );
      setPasswordValid(isValid);
      if (!isValid) {
        setPasswordError(
          "Password must be at least 8 characters long, include one lowercase letter, one uppercase letter, one number, and one special character"
        );
      }
    }
  };

  const registerUser = async () => {

    if (!usernameValid || !passwordValid) {
      alert("Please fix the errors in the form before submitting");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user", {
        username,
        password,
      });

      // If the registration is successful
      if (response.status === 201) {
        // alert(response.data.message); // User successfully created
        // Redirect to login page
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
          alert(
            "An error occurred during registration. Please try again later."
          );
        }
      } else {
        // Handle non-Axios error
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form>
            <div className="text-center mb-4">
              <img id="logo-img" src={logo} alt="PicPics logo" />
            </div>
            <h1>Register to start using PicPics</h1>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  validateUsername(e.target.value);
                }}
                onBlur={(e) => validateUsername(e.target.value)}
                className={
                  username.trim().length > 0 && !usernameValid
                    ? "is-invalid"
                    : ""
                }
              />
              {username.trim().length > 0 && !usernameValid && (
                <div className="invalid-feedback">{usernameError}</div>
              )}
            </InputGroup>
            <InputGroup className="mb-4">
              <FormControl
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  validatePassword(e.target.value);
                }}
                onBlur={(e) => validatePassword(e.target.value)}
                className={
                  password.trim().length > 0 && !passwordValid
                    ? "is-invalid"
                    : ""
                }
              />
              {password.trim().length > 0 && !passwordValid && (
                <div className="invalid-feedback">{passwordError}</div>
              )}
            </InputGroup>

            <div className="d-grid gap-2">
              <Button variant="primary" type="button" onClick={registerUser}>
                Register
              </Button>
            </div>
          </Form>
          <div className="text-center mt-4">
            <p className="mb-3">Already have an Account?</p>
            <Button
              variant="outline-primary"
              className="signup-btn"
              onClick={() => setDisplay(AppDisplay.LOGIN_PAGE)}
            >
              LOGIN TO PICPICS
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
