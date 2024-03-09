import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppDisplay } from "../../App";
import { Container, Row, Col, Button } from "react-bootstrap";
import { LoadingIndicator } from "./LoadingIndicator";
import { Logo } from "./Logo";
import { LoginForm } from "./LoginForm";
import "./LoginPage.css";

const LOGIN_PROMPT = "Welcome to PicPics! Login to access your images!";

axios.defaults.withCredentials = true;

interface CombinedPageProps {
  setDisplay: (display: AppDisplay) => void;
}

const LoginPage: React.FC<CombinedPageProps> = ({ setDisplay }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{ isAuthenticated: boolean; username: string }>("http://localhost:8080/user/checkSession");
        if (response.data.isAuthenticated) {
          console.log(`User ${response.data.username} is already logged in.`);
          setDisplay(AppDisplay.HOME_PAGE);
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [setDisplay]);

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
            <Col md={6}>
              <Logo />
              <h2 className="text-center mb-4">{LOGIN_PROMPT}</h2>
              <LoginForm onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
              <div className="text-center mt-4">
                <p>Don’t have an account?</p>
                <Button variant="outline-primary" onClick={() => setDisplay(AppDisplay.REGISTER_PAGE)}>
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
