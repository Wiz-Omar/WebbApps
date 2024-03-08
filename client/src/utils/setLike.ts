import axios from 'axios';

const baseUrl = 'http://localhost:8080';

// Toggle like/unlike status for an image
export const setLike = async (imageId: string, like: boolean): Promise<boolean> => {
    try {
        const url = `${baseUrl}/like/${imageId}`;
        if (like) {
            await axios.post(url);
        } else {
            await axios.delete(url);
        }
        return like;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
