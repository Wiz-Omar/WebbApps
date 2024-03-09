/**
 * Error for when the user is not found in the database.
 * This error is thrown when a user tries to log in with a username that does not exist.
 */
export class UserNotFoundError extends Error {
    constructor(username: string) {
      super(`User with username ${username} not found`);
      this.name = "UserNotFoundError";
    }
}

/**
 * Error for when the user already exists in the database.
 * This error is thrown when a user tries to register with a username that already exists.
 */
export class UserExistsError extends Error {
    constructor(username: string) {
      super(`User with username ${username} already exists`);
      this.name = "UserExistsError";
    }
}

/**
 * Error for when the user has entered invalid credentials.
 * This error is thrown when a user tries to log in or register with invalid credentials.
 */
export class InvalidCredentialsError extends Error {
    constructor() {
      super(`Invalid credentials`);
      this.name = "InvalidCredentialsError";
    }
  }