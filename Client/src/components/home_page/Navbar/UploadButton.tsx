import React, { useRef } from "react";
import axios from "axios";
import { handleUpload } from "../../../utils/handleUpload";
import { validateFile } from "../../../utils/validateFile";
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
    
    try {
      validateFile(file);
    } catch (error : any) {
      // If file is unvalid, display the error message and return
      alert(error.message);
      return;
    }
    
    try {
      // If validateFile passes, we know that the file is a correctly formatted image
      await handleUpload(file as File);
      callback();
    } catch (error: any) {
      console.error("Error uploading file:", error); // Handle error
      console.error("Error: " + error.response.status);
      if (error.response && error.response.status === 409) {
        // Duplicate filename error
        alert("A file with that name already exists. Please choose a different filename.");
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
        data-testid="file-input"
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
