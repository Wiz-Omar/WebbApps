import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, USERNAME_PATTERN } from "../constants/validation";

export const validateUsername = (username: string): string => {
  if (username.trim().length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters long`;
  } else if (!USERNAME_PATTERN.test(username)) {
    return "Username must be alphanumeric";
  }
  return "";
};

export const validatePassword = (password: string): string => {
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }
  return "";
};
