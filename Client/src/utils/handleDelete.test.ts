import axios from 'axios';
import { handleDelete } from './handleDelete';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

/* * - 200: Image deleted successfully.
* - 401: Unauthorized if the user is not logged in.
* - 404: Image not found.
* - 500: Internal server error. ImageId was not found, or deletion failed. */
describe('handleDelete', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle 200 successful delete', async () => {
        // Arrange
        const imageId = 123;
        mockedAxios.delete.mockResolvedValueOnce({ status: 200 });

        // Act
        const result = await handleDelete(imageId);

        // Assert
        expect(result.status).toBe(200);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`http://localhost:8080/image/${imageId}`);
        expect(mockedAxios.defaults.withCredentials).toBe(true);
    });

    it('should handle 401 user not logged in', async () => {
        // Arrange
        const imageId = 456;
        const errorMessage = 'Image not found';
        const errorResponse = { response: { status: 404, data: { message: errorMessage } } };
        mockedAxios.delete.mockRejectedValueOnce(errorResponse);

        // Act & Assert
        await expect(handleDelete(imageId)).rejects.toEqual(errorResponse);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`http://localhost:8080/image/${imageId}`);
        expect(mockedAxios.defaults.withCredentials).toBe(true);
    });

    it('should handle 404 image not found', async () => {
        // Arrange
        const imageId = 789;
        const errorMessage = 'Image not found';
        const errorResponse = { response: { status: 404, data: { message: errorMessage } } };
        mockedAxios.delete.mockRejectedValueOnce(errorResponse);

        // Act & Assert
        await expect(handleDelete(imageId)).rejects.toEqual(errorResponse);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`http://localhost:8080/image/${imageId}`);
        expect(mockedAxios.defaults.withCredentials).toBe(true);
    });
});
