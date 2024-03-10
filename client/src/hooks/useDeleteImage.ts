import { useState } from 'react';
import { AxiosError } from 'axios';
import { handleDelete } from '../utils/handleDelete';


interface DeleteImageResponse {
    success: boolean;
    message: string;
}

const useDeleteImage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | null>(null);

    const deleteImage = async (imageId: string): Promise<DeleteImageResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await handleDelete(imageId);
            setIsLoading(false);
            return { success: true, message: response.data.message };
        } catch (err: any) {
            setError(err);
            setIsLoading(false);
            throw err; // Rethrow to let the component handle the error
        }
    };

    return { deleteImage, isLoading, error };
};

export default useDeleteImage;
