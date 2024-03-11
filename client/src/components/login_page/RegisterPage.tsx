import React, { useState } from "react";
import axios from "axios";
import { AppDisplay } from "../../App";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./LoginPage.css"; // Reuse styles from LoginPage

import { RegisterForm } from "./RegisterForm";
import { Logo } from "./Logo";

axios.defaults.withCredentials = true;

const REGISTER_PROMPT =
  "Don't have an account? Register to start using PicPics";

interface RegisterPageProps {
  setDisplay: (display: AppDisplay) => void;
}

/**
 * A component that renders the registration page. This page includes a registration form for new users
 * to create an account. Upon successful registration, the user is redirected to the login page.
 *
 * The component also provides a button to navigate to the login page for users who already have an account.
 *
 * Props:
 *  - setDisplay: Function - A callback function that sets the current display component of the app.
 *    It is used to navigate between different parts of the application, such as from the registration page to
 *    the login page or the home page.
 */
const RegisterPage: React.FC<RegisterPageProps> = ({ setDisplay }) => {
  // Handle successful registration by redirecting to the login page
  const handleRegisterSuccess = () => {
    setDisplay(AppDisplay.LOGIN_PAGE);
  };

  // Handle registration errors by displaying an alert with the error message
  const handleRegisterError = (error: string) => {
    alert(error); // Display an alert with the error message
  };

  return (
    <div>
      <Container className="register-container">
        <Row className="justify-content-md-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Logo />
            <h2 className="text-center mb-4">{REGISTER_PROMPT}</h2>
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onRegisterError={handleRegisterError}
            />
            <div className="text-center mt-4">
              <p>Already have an account?</p>
              <Button
                variant="outline-primary"
                onClick={() => setDisplay(AppDisplay.LOGIN_PAGE)}
              >
                LOG IN
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
