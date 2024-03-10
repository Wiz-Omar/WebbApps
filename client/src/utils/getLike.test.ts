import axios from 'axios';
import { getLikeStatus } from './getLike';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getLikeStatus', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true if the image is liked', async () => {
        // Arrange
        const imageId = '123';
        const likeStatusResponse = { liked: true };
        mockedAxios.get.mockResolvedValueOnce({ status: 200, data: likeStatusResponse });

        // Act
        const result = await getLikeStatus(imageId);

        // Assert
        expect(result).toBe(true);
        expect(mockedAxios.get).toHaveBeenCalledWith(`http://localhost:8080/like/${imageId}`);
    });

    it('should return false if the image is not liked', async () => {
        // Arrange
        const imageId = '456';
        const likeStatusResponse = { liked: false };
        mockedAxios.get.mockResolvedValueOnce({ status: 200, data: likeStatusResponse });

        // Act
        const result = await getLikeStatus(imageId);

        // Assert
        expect(result).toBe(false);
        expect(mockedAxios.get).toHaveBeenCalledWith(`http://localhost:8080/like/${imageId}`);
    });

    it('should throw an error if the request fails', async () => {
        // Arrange
        const imageId = '789';
        const errorMessage = 'Error fetching like status';
        const errorResponse = new Error(errorMessage);
        mockedAxios.get.mockRejectedValueOnce(errorResponse);

        // Act & Assert
        await expect(getLikeStatus(imageId)).rejects.toThrow(errorResponse);
        expect(mockedAxios.get).toHaveBeenCalledWith(`http://localhost:8080/like/${imageId}`);
    });
});
