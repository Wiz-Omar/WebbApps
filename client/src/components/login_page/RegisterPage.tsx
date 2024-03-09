import React, { useState } from "react";
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
import "./LoginPage.css"; // Reuse styles from LoginPage

import logo from "../../assets/img/squid.png";
import { RegisterForm } from "./RegisterForm";
import { Logo } from "./Logo";

axios.defaults.withCredentials = true;

interface RegisterPageProps {
  setDisplay: (display: AppDisplay) => void;
}

const MIN_USERNAME_LENGTH = 8;
const MIN_PASSWORD_LENGTH = 8;
const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/; // Only alphanumeric characters allowed
const REGISTER_PROMPT = "Don't have an account? Register to start using PicPics";

const RegisterPage: React.FC<RegisterPageProps> = ({ setDisplay }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameValid, setUsernameValid] = useState(false); // assume invalid by default
  const [passwordValid, setPasswordValid] = useState(false); // assume invalid by default

  const handleRegisterSuccess = () => {
    setDisplay(AppDisplay.LOGIN_PAGE);
  };

  const handleRegisterError = (error: string) => {
    alert(error); // Show an alert or handle the error as appropriate
  };
  return (
    <div>
      <Container className="register-container">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Logo />
            <h2 className="text-center mb-4">{REGISTER_PROMPT}</h2>
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} onRegisterError={handleRegisterError} />
            <div className="text-center mt-4">
              <p>Already have an account?</p>
              <Button variant="outline-primary" onClick={() => setDisplay(AppDisplay.LOGIN_PAGE)}>
                LOG IN
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RegisterPage;
