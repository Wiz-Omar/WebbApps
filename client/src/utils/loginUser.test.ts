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
    const onLoginSuccess = jest.fn();
    const onLoginError = jest.fn();

    // Mock axios post method for login failure due to invalid credentials
    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 401 }
    });

    await performLogin({ username, password, onLoginSuccess, onLoginError });

    // Expectations
    expect(onLoginSuccess).not.toHaveBeenCalled();
    expect(onLoginError).toHaveBeenCalledWith("Invalid username or password");
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
