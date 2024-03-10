import axios from "axios";

const LOGIN_ENDPOINT = "http://localhost:8080/user/login";

/**
 * Attempts to log in a user with the provided username and password. 
 * If successful, executes the `onLoginSuccess` callback. If an error occurs,
 * the `onLoginError` callback is executed with an error message.
 * 
 * @param username - The username to log in with.
 * @param password - The password to log in with.
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
      onLoginError("An unexpected error occurred");
    }
  }
};