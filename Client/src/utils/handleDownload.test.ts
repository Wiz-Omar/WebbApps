import { handleDownload } from './handleDownload'; 
import { Image } from "../components/home_page/HomePage";

// Mock image data
const image: Image = {
    filename: 'test-image.png',
    path: 'https://example.com/test-image.png',
    id: 1,
    uploadDate: new Date()
};

describe('handleDownload function', () => {
    it('initiates download of the given image', async () => {
        // Mock blob response
        const blob = new Blob([''], { type: 'image/png' });
        const response = new Response(blob);

        // Mock fetch function to return the blob response
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(response);

        // Mock createObjectURL and revokeObjectURL methods
        const createObjectURLMock = jest.fn();
        const revokeObjectURLMock = jest.fn();
        window.URL.createObjectURL = createObjectURLMock;
        window.URL.revokeObjectURL = revokeObjectURLMock;

        // Call the handleDownload function
        await handleDownload(image);

        // Expectations
        expect(fetch).toHaveBeenCalledWith(image.path);
        expect(createObjectURLMock).toHaveBeenCalledWith(blob);
        expect(revokeObjectURLMock).toHaveBeenCalled();
    });
});
