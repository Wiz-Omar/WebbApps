import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import { EyeSlashFill, EyeFill } from "react-bootstrap-icons"; // Make sure to import EyeFill as well

interface LoginFormProps {
  onLoginSuccess: () => void;
  onLoginError: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onLoginError,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        username,
        password,
      });
      if (response.status === 200) {
        console.log(response.data.message);
        onLoginSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          onLoginError("Invalid username or password");
        } else if (error.response?.status === 400) {
          onLoginError("Invalid input data for username or password");
        } else {
          onLoginError("An error occurred. Please try again later.");
        }
      } else {
        console.error("An unexpected error occurred:", error);
        onLoginError("An unexpected error occurred");
      }
    }
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
