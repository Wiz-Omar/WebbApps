export const MIN_USERNAME_LENGTH = 8;
export const MIN_PASSWORD_LENGTH = 8;
export const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/; // Only alphanumeric characters allowed

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
