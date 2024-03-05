import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppDisplay } from "../../App";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import "./LoginPage.css";

import logo from "../../assets/img/squid.png";

axios.defaults.withCredentials = true;

interface CombinedPageProps {
  setDisplay: (display: AppDisplay) => void;
}

const LoginPage: React.FC<CombinedPageProps> = ({ setDisplay }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          isAuthenticated: boolean;
          username: string;
        }>("http://localhost:8080/user/checkSession");
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

  const loginUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:8080/user/login", {
        username,
        password,
      });
      if (response.status === 200) {
        console.log(response.data.message);
        setDisplay(AppDisplay.HOME_PAGE);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Invalid username or password");
        } else if (error.response?.status === 400) {
          alert("Invalid input data for username or password");
        } else {
          alert("An error occurred. Please try again later.");
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
    <Container className="login-container">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form>
            <div className="text-center mb-4">
              <img
                id="logo-img" // Make sure this matches your CSS class
                src={logo}
                alt="PicPics logo"
              />
            </div>
            <h1>Login to access your files in PicPics</h1>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Email address or username"
                aria-label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>

            <InputGroup className="mb-4">
              <FormControl
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  loginUser(e);
                }}
              >
                LOG IN
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="mb-3">Don't have an account?</p>
              <Button
                variant="outline-primary"
                className="signup-btn"
                onClick={() => setDisplay(AppDisplay.REGISTER_PAGE)}
              >
                SIGN UP FOR PICPICS
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>      )}
    </div>
  );
};

export default LoginPage;
