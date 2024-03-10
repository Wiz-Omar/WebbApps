import { useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

// useDeleteImage.ts

interface DeleteImageResponse {
    // Define the shape of the response data
    // based on your API's response
    // Example: { success: boolean }
}

const useDeleteImage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | null>(null);

    const deleteImage = async (imageId: string): Promise<DeleteImageResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response: AxiosResponse<DeleteImageResponse> = await axios.delete(`/api/images/${imageId}`);
            setIsLoading(false);
            return response.data;
        } catch (err: any) {
            setError(err);
            setIsLoading(false);
            throw err; // Rethrow to let the component handle the error
        }
    };

    return { deleteImage, isLoading, error };
};

export default useDeleteImage;
