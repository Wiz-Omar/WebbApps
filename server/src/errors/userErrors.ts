export class UserNotFoundError extends Error {
    constructor(username: string) {
      super(`User with username ${username} not found`);
      this.name = "UserNotFoundError";
    }
}

export class UserExistsError extends Error {
    constructor(username: string) {
      super(`User with username ${username} already exists`);
      this.name = "UserExistsError";
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
      super(`Invalid credentials`);
      this.name = "InvalidCredentialsError";
    }
  }