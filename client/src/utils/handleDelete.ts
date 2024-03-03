import axios from "axios";
axios.defaults.withCredentials = true;

export const handleDelete = async (imageId: number) => {
    return await axios.delete(
        `http://localhost:8080/image/${imageId}`
      );
}