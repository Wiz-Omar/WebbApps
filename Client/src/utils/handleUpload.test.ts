import { handleUpload } from './handleUpload'; // Import the function to be tested
import axios from 'axios';

jest.mock('axios');
// Create an object of type of mocked Axios.
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Handle Upload function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful upload', async () => {
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const responseData = { success: true };
    mockedAxios.post.mockResolvedValueOnce({ data: responseData }); // Mocking axios response

    const response = await handleUpload(file);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8080/image',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        responseType: 'json',
      }
    );

    expect(response.data).toEqual(responseData); // Verify that the response data matches the mocked data
  });

  it('should handle duplicate filename error', async () => {
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    mockedAxios.post.mockRejectedValueOnce({ response: { status: 409 } }); // Mocking axios error response

    await expect(handleUpload(file)).rejects.toEqual({ response: { status: 409 } }); // Verify that the function rejects with the mocked error
  });
});
