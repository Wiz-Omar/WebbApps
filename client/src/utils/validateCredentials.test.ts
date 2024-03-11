import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "../constants/validation";
import { validatePassword, validateUsername } from "./validateCredentials";

describe('validateUsername', () => {
  it('should return an error for usernames shorter than the minimum length', () => {
    const shortUsername = 'user';
    const errorMessage = `Username must be at least ${MIN_USERNAME_LENGTH} characters long`;
    expect(validateUsername(shortUsername)).toBe(errorMessage);
  });

  it('should return an error for usernames with non-alphanumeric characters', () => {
    const invalidUsername = 'user@123';
    const errorMessage = "Username must be alphanumeric";
    expect(validateUsername(invalidUsername)).toBe(errorMessage);
  });

  it('should return an empty string for valid usernames', () => {
    const validUsername = 'user1234';
    expect(validateUsername(validUsername)).toBe('');
  });
});

describe('validatePassword', () => {
  it('should return an error for passwords shorter than the minimum length', () => {
    const shortPassword = 'pass';
    const errorMessage = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
    expect(validatePassword(shortPassword)).toBe(errorMessage);
  });

  it('should return an empty string for valid passwords', () => {
    const validPassword = 'password123';
    expect(validatePassword(validPassword)).toBe('');
  });
});
