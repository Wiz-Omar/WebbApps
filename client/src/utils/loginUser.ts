import axios from "axios";
import { LOGIN_ENDPOINT } from "../constants/apiEndpoints";

/**
 * Attempts to log in a user with the provided username and password. 
 * If successful, executes the `onLoginSuccess` callback. If an error occurs,
 * the `onLoginError` callback is executed with an error message.
 * 
 * @param username - The username to log in with.
 * @param password - The password to log in with.
 * @param onLoginSuccess - A callback to execute if the login is successful.
 * @param onLoginError - A callback to execute if the login fails.
 * @returns A promise that resolves to the response from the server.
 */
export const performLogin = async ({
    username,
    password,
    onLoginSuccess,
    onLoginError
}: {
    username: string,
    password: string,
    onLoginSuccess: () => void,
    onLoginError: (errorMessage: string) => void
}) => {
  try {
    const response = await axios.post(LOGIN_ENDPOINT, {
      username,
      password,
    });
    if (response.status === 200) {
      console.log(response.data.message);
      onLoginSuccess();
    }
  } catch (error : any) {
    if (error.response?.status === 401) {
      onLoginError("Invalid username or password");
    } else if (error.response?.status === 400) {
      onLoginError("Invalid input data for username or password");
    } else if (error.response?.status === 500) {
      onLoginError("Internal server error. Please try again later.");
    } else {
      onLoginError("An unexpected error occurred");
    }
  }
};
