// Assuming this is in a file like handleDelete.ts
import axios, { AxiosResponse } from "axios";
import { IMAGE_ENDPOINT } from "../constants/apiEndpoints";

axios.defaults.withCredentials = true;

export const handleDelete = async (imageId: string): Promise<AxiosResponse<any>> => {
    return await axios.delete(`${IMAGE_ENDPOINT}/${imageId}`);
};
