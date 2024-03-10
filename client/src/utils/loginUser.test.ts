import axios from 'axios';
import { performLogin } from './loginUser';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const LOGIN_ENDPOINT = "http://localhost:8080/user/login";

describe('performLogin', () => {
  const username = 'testuser';
  const password = 'password123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onLoginSuccess on successful login', async () => {
    const onLoginSuccess = jest.fn();
    const onLoginError = jest.fn();

    // Mock axios post method for successful login
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { message: 'Login successful' } });

    await performLogin({ username, password, onLoginSuccess, onLoginError });

    // Expectations
    expect(mockedAxios.post).toHaveBeenCalledWith(LOGIN_ENDPOINT, { username, password });
    expect(onLoginSuccess).toHaveBeenCalled();
    expect(onLoginError).not.toHaveBeenCalled();
  });

  it('calls onLoginError with "Invalid username or password" for 401 response', async () => {
    // Define mock functions for onLoginSuccess and onLoginError callbacks
    const onLoginSuccess = jest.fn();
    const onLoginError = jest.fn();

    // Mock axios.post to return a rejected promise with a 401 response
    (axios.post as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });

    // Call the performLogin function
    await performLogin({
        username: 'testUsername',
        password: 'testPassword',
        onLoginSuccess,
        onLoginError
    });

    // Expect onLoginSuccess not to have been called
    expect(onLoginSuccess).not.toHaveBeenCalled();
    
    // Expect onLoginError to have been called with the correct error message
    expect(onLoginError).toHaveBeenCalledWith("Invalid username or password");
});

it('calls onLoginError with "Internal server error. Please try again later." for 500 response', async () => {
  // Define mock functions for onLoginSuccess and onLoginError callbacks
  const onLoginSuccess = jest.fn();
  const onLoginError = jest.fn();

  // Mock axios.post to return a rejected promise with a 500 response
  (axios.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } });

  // Call the performLogin function
  await performLogin({
      username: 'testUsername',
      password: 'testPassword',
      onLoginSuccess,
      onLoginError
  });

  // Expect onLoginSuccess not to have been called
  expect(onLoginSuccess).not.toHaveBeenCalled();
  
  // Expect onLoginError to have been called with the correct error message
  expect(onLoginError).toHaveBeenCalledWith("Internal server error. Please try again later.");
});

  it('calls onLoginError with a generic error message for other errors', async () => {
    const onLoginSuccess = jest.fn();
    const onLoginError = jest.fn();

    // Mock axios post method for a generic error (e.g., server error or network issue)
    mockedAxios.post.mockRejectedValueOnce(new Error());

    await performLogin({ username, password, onLoginSuccess, onLoginError });

    // Expectations
    expect(onLoginSuccess).not.toHaveBeenCalled();
    expect(onLoginError).toHaveBeenCalledWith("An unexpected error occurred");
  });
});
