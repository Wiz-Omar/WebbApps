import axios from 'axios';
import { handleChangeName } from './handleChangeName';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('handleChangeName', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful rename', async () => {
        const imageId = 1;
        const filename = 'test';
        const fileExtension = 'jpg';
    
        const mockResponse = {
            data: {},
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
        };
    
        mockedAxios.patch.mockResolvedValueOnce(mockResponse);
    
        const response = await handleChangeName(imageId, filename, fileExtension);
    
        expect(mockedAxios.patch).toHaveBeenCalledWith(
            `http://localhost:8080/image/${imageId}`,
            {
                newFilename: `${filename}.${fileExtension}`,
            }
        );
    
        expect(response).toEqual(mockResponse);
    });
    

    it('should handle file not found error', async () => {
        const imageId = 1;
        const filename = 'test';
        const fileExtension = 'jpg';

        const mockErrorResponse = {
            response: {
                data: {
                    error: 'File not found'
                },
                status: 404,
                statusText: 'Not Found',
                headers: {},
                config: {}
            }
        };

        mockedAxios.patch.mockRejectedValueOnce(mockErrorResponse);

        await expect(handleChangeName(imageId, filename, fileExtension)).rejects.toEqual(mockErrorResponse);

        expect(mockedAxios.patch).toHaveBeenCalledWith(
            `http://localhost:8080/image/${imageId}`,
            {
                newFilename: `${filename}.${fileExtension}`,
            }
        );
    });
});
