import React, { useRef } from "react";
import axios from "axios"; // Assuming you might want to send the Base64 to a server.

const UploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;
  
    // Create an instance of FormData
    const formData = new FormData();
    
    // Append the file to the FormData instance
    formData.append('file', file);
  
    // Use axios to send the FormData
    await axios.post("http://localhost:8080/image", formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' // This header tells the server about the type of the data
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      responseType: "json",
    }).then(response => {
      console.log(response); // Handle success
    }).catch(error => {
      console.error("Error uploading file:", error); // Handle error
    });
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
};

export default UploadButton;
