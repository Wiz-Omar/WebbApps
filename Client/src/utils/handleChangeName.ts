import axios from "axios";
axios.defaults.withCredentials = true;

export const handleChangeName = async (imageId: number, filename : string, fileExtension : string) => {
    return await axios.patch(`http://localhost:8080/image/${imageId}`, {
        newFilename: `${filename}.${fileExtension}`,
    });
}
