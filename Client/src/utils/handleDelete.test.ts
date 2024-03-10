import axios from 'axios';
import { handleDelete } from './handleDelete';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('handleDelete', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle 200 successful delete', async () => {
        // Arrange
        const imageId = 123;
        mockedAxios.delete.mockResolvedValueOnce({ status: 200 });

        // Act
        const result = await handleDelete(imageId.toString());

        // Assert
        expect(result.status).toBe(200);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`http://localhost:8080/image/${imageId}`);
        expect(mockedAxios.defaults.withCredentials).toBe(true);
    });

    it('should handle 404 image not found', async () => {
        // Arrange
        const imageId = 456;
        const errorMessage = 'Image not found';
        const errorResponse = { response: { status: 404, data: { message: errorMessage } } };
        mockedAxios.delete.mockRejectedValueOnce(errorResponse);

        // Act & Assert
        await expect(handleDelete(imageId.toString())).rejects.toEqual(errorResponse);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`http://localhost:8080/image/${imageId}`);
        expect(mockedAxios.defaults.withCredentials).toBe(true);
    });
});
