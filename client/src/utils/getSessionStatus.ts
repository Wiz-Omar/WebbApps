import axios from "axios";
import { API_BASE_URL } from "../constants/apiEndpoints";

axios.defaults.withCredentials = true;

export interface SessionResponse {
  isAuthenticated: boolean;
  username: string;
}

/**
 * A function that sends a request to the server to check the current session status of the user.
 * @returns A promise that resolves to a SessionResponse object containing the current session status of the user.
 */
export async function getSessionStatus(): Promise<SessionResponse> {
  const response = await axios.get<SessionResponse>(
    `${API_BASE_URL}/user/checkSession`
  );
  return response.data;
}
