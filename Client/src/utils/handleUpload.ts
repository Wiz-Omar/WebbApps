import axios from "axios";
import { IMAGE_ENDPOINT } from "../constants/apiEndpoints";
axios.defaults.withCredentials = true;

/**
 * Handle the upload of an image. Make a POST request to the server. Use FormData to send the file.
 * @param file The file to upload. Type File is a built-in type in TypeScript.
 * @returns A promise that resolves to the response from the server.
 */
export const handleUpload = async (file: File) => {
  // Create an instance of FormData
  const formData = new FormData();

  // Append the file to the FormData instance
  formData.append("file", file);

  // Use axios to send the FormData
  return axios.post(IMAGE_ENDPOINT, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // This header tells the server about the type of the data
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    responseType: "json",
  });
};
