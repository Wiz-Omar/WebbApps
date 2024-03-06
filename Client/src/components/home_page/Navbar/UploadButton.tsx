import React, { useRef } from "react";
import axios from "axios";
import { handleUpload } from "../../../utils/handleUpload";
axios.defaults.withCredentials = true;

interface UploadButtonProps {
  callback: () => void;
}

function UploadButton({ callback }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file : File | null = event.target.files ? event.target.files[0] : null;
    if (!file) return;
    // Check if the filname is less than 150 characters. //TODO: might make even smaller.
    if (file.name.length > 256) {
      alert("Filename should be less than 256 characters.");
      return;
    }

    // Check if the file type is JPEG, JPG, or PNG
    if (!file.type.match("image/jpeg") && !file.type.match("image/png") && !file.type.match("image/jpg")) {
      alert("Unsupported filetype. Supported filetypes are JPEG, JPG and PNG.");
      return;
    }

    // Check if the file size is greater than 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB.");
      return;
    }

    // TODO: check filename doesnt contain special characters?

    try {
      const response = await handleUpload(file);
      // console.log((response).status);
      callback();
    } catch (error: any) {
      console.error("Error uploading file:", error); // Handle error
      if (error.response && error.response.status === 409) {
        // Duplicate filename error
        alert("A file with the same name already exists. Please choose a different filename.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button className="btn btn-primary" onClick={triggerFileInputClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
        Upload
      </button>
    </div>
  );
}

export default UploadButton;
