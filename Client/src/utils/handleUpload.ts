import axios from "axios";
axios.defaults.withCredentials = true;

export const handleUpload = async (file : File) => {
    // Create an instance of FormData
    const formData = new FormData();

    // Append the file to the FormData instance
    formData.append("file", file);

    // Use axios to send the FormData
    return await axios.post(
    "http://localhost:8080/image",
    formData,
    {
        headers: {
        "Content-Type": "multipart/form-data", // This header tells the server about the type of the data
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        responseType: "json",
    }
    );
}