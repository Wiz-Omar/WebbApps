// Assuming this is in a file like handleDelete.ts
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:8080"; // Ensure this base URL is correct

axios.defaults.withCredentials = true;

export const handleDelete = async (imageId: string): Promise<AxiosResponse<any>> => {
    return await axios.delete(`${API_BASE_URL}/image/${imageId}`);
};
