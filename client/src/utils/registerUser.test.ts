import axios from 'axios';
import { registerUser } from './registerUser';

const REGISTER_ENDPOINT = "http://localhost:8080/user";

// Mock the axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('registerUser', () => {
  // Define common variables for tests
  const username = 'testUser';
  const password = 'testPassword';
  const onSuccess = jest.fn();
  const onError = jest.fn();

  afterEach(() => {
    // Clear mocks after each test
    mockedAxios.post.mockClear();
    onSuccess.mockClear();
    onError.mockClear();
  });

  it('should call onRegisterSuccess for successful registration', async () => {
    // Arrange
    mockedAxios.post.mockResolvedValueOnce({ status: 201 });

    // Act
    await registerUser({ username, password, onRegisterSuccess: onSuccess, onRegisterError: onError });

    // Assert
    expect(mockedAxios.post).toHaveBeenCalledWith(REGISTER_ENDPOINT, { username, password });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onRegisterError with appropriate message for 400 error', async () => {
    // Arrange
    const errorMessage = "Invalid request. Please ensure all fields are filled out correctly.";
    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 400 }
    });

    // Act
    await registerUser({ username, password, onRegisterSuccess: onSuccess, onRegisterError: onError });

    // Assert
    expect(mockedAxios.post).toHaveBeenCalledWith(REGISTER_ENDPOINT, { username, password });
    expect(onError).toHaveBeenCalledWith(errorMessage);
  });

  it('should call onRegisterError with appropriate message for 409 error', async () => {
    // Arrange
    const errorMessage = "An account with this username already exists.";
    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 409 }
    });

    // Act
    await registerUser({ username, password, onRegisterSuccess: onSuccess, onRegisterError: onError });

    // Assert
    expect(mockedAxios.post).toHaveBeenCalledWith(REGISTER_ENDPOINT, { username, password });
    expect(onError).toHaveBeenCalledWith(errorMessage);
  });

});
