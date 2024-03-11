import axios from "axios";
import { REGISTER_ENDPOINT } from "../constants/apiEndpoints";

/**
 * Attempts to register a new user with the provided username and password. 
 * If successful, executes the `onRegisterSuccess` callback. If an error occurs,
 * the `onRegisterError` callback is executed with an error message.
 * 
 * @param username - The username to register with.
 * @param password - The password to register with.
 * @param onRegisterSuccess - A callback to execute if the registration is successful.
 * @param onRegisterError - A callback to execute if the registration fails.
 * @returns A promise that resolves to the response from the server.
 */
export const registerUser = async ({
    username,
    password,
    onRegisterSuccess,
    onRegisterError
}: {
    username: string,
    password: string,
    onRegisterSuccess: () => void,
    onRegisterError: (errorMessage: string) => void
}) => {
  try {
    const response = await axios.post(REGISTER_ENDPOINT, {
      username,
      password,
    });
    if (response.status === 201) {
      onRegisterSuccess();
    } else {
      onRegisterError("Registration was successful, but an unexpected response was received. Please verify your account status.");
    }
  } catch (error : any) {
    let errorMsg = "An unexpected error occurred during registration. Please try again later.";
    switch (error.response?.status) {
      case 400:
        errorMsg = "Invalid request. Please ensure all fields are filled out correctly.";
        break;
      case 409:
        errorMsg = "An account with this username already exists.";
        break;
      case 500:
        errorMsg = "A server error occurred. Please try again later.";
        break;
      default:
        break;
    }
    onRegisterError(errorMsg);
  }
};
