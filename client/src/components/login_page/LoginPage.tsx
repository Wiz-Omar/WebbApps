import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppDisplay } from "../../App";
import { Container, Row, Col, Button } from "react-bootstrap";
import { LoadingIndicator } from "./LoadingIndicator";
import { Logo } from "./Logo";
import { LoginForm } from "./LoginForm";
import "./LoginPage.css";
import { API_BASE_URL } from "../../constants/apiEndpoints";
import { useCheckUserAuthentication } from "../../hooks/useCheckUserAuthentication";

const LOGIN_PROMPT = "Welcome to PicPics! Login to access your images!";

axios.defaults.withCredentials = true;

interface CombinedPageProps {
  setDisplay: (display: AppDisplay) => void;
}

/**
 * A component that renders the login page. This page includes a login form for existing users
 * to authenticate themselves. Upon successful login, the user is redirected to the home page.
 * If the user is already logged in (session check is positive), they are immediately redirected
 * to the home page, bypassing the login form.
 *
 * The component also provides a button to navigate the registration page for users who do not have an account.
 *
 * Props:
 *  - setDisplay: Function - A callback function that sets the current display component of the app.
 *    It is used to navigate between different parts of the application, such as from the login page to
 *    the home page or the registration page.
 */
const LoginPage: React.FC<CombinedPageProps> = ({ setDisplay }) => {
  // Use the custom hook to check if the user is already authenticated
  const { isLoading, isAuthenticated } = useCheckUserAuthentication();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setDisplay(AppDisplay.HOME_PAGE);
    }
  }, [isAuthenticated, setDisplay]);

  const handleLoginSuccess = () => {
    setDisplay(AppDisplay.HOME_PAGE);
  };

  const handleLoginError = (error: string) => {
    alert(error);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Container className="login-container">
          <Row className="justify-content-md-center">
            <Col xs={12} sm={10} md={8} lg={6}>
              <Logo />
              <h2 className="text-center mb-4">{LOGIN_PROMPT}</h2>
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onLoginError={handleLoginError}
              />
              <div className="text-center mt-4">
                <p>Don’t have an account?</p>
                <Button
                  variant="outline-primary"
                  onClick={() => setDisplay(AppDisplay.REGISTER_PAGE)}
                >
                  SIGN UP
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default LoginPage;
