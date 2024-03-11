import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/apiEndpoints";
import axios from "axios";

interface SessionResponse {
  isAuthenticated: boolean;
  username: string;
}

interface AuthenticationStatus {
  isLoading: boolean;
  isAuthenticated: boolean;
  username: string | null;
}

export const useCheckUserAuthentication = (): AuthenticationStatus => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const response = await axios.get<SessionResponse>(
          `${API_BASE_URL}/user/checkSession`
        );
        console.log(response.data);
        setIsAuthenticated(response.data.isAuthenticated);
        setUsername(response.data.username);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Session check failed", error.message);
        } else {
          console.error("An unexpected error occurred", error);
        }
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuthentication();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return { isLoading, isAuthenticated, username };
};
