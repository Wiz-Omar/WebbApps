import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/apiEndpoints";
import axios from "axios";
import { getSessionStatus } from "../utils/getSessionStatus";

export interface AuthenticationStatus {
  isLoading: boolean;
  isAuthenticated: boolean;
  username: string | null;
}

/**
 * A custom hook that checks if the user is already authenticated. This hook uses the method fetchSessionStatus to
 * check the current session status of the user. It returns an object containing the current authentication status of the user.
 * 
 * @returns An object containing the current authentication status of the user.
 */
export const useCheckUserAuthentication = (): AuthenticationStatus => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const sessionResponse = await getSessionStatus();
        setIsAuthenticated(sessionResponse.isAuthenticated);
        setUsername(sessionResponse.username);
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
  }, []); 

  return { isLoading, isAuthenticated, username };
};
