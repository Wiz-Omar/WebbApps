import React, { useRef } from "react";
import axios from "axios";
import { handleUpload } from "../../../utils/handleUpload";
import { Upload } from "react-bootstrap-icons";
import { CustomFileError } from "../../../errors/fileErrors";

axios.defaults.withCredentials = true;

interface UploadButtonProps {
  callback: () => void;
}

/**
 * A button that allows the user to upload an image file. Uses the `handleUpload` function to send the file to the server.
 *
 * Props:
 * - `callback` (function): A callback function that is called after a successful upload operation. It can be used
 *   to trigger a re-fetch or update of the parent component's state.
 */
function UploadButton({ callback }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Triggers a click event on the file input element, which opens the file picker dialog.
   */
  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Validates the selected file and sends it to the server using the `handleUpload` function. If the upload is successful,
   * the `callback` function is called to trigger a re-fetch or update of the parent component's state.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | null = event.target.files ? event.target.files[0] : null;

    try {
      await handleUpload(file);
      callback();
    } catch (error: any) {
      if (error instanceof CustomFileError) {
        // File did not pass validateFile
        alert(error.message);
      }
      else if (error.response) {
        // HTTP error response from the server
        if (error.response.status === 409) {
          // Duplicate filename error
          alert("A file with that name already exists. Please rename the file and try again.");
        } else if (error.response.status === 413) {
          // File too large error
          alert("The file is too large. Please upload a file that is less than 5MB.");
        } else if (error.response.status === 415) {
          // Unsupported file type error
          alert("The file type is not supported. Please upload a .jpg, .jpeg, or .png file.");
        }
      } else {
        // Something else went wrong
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
        <Upload /> Upload
      </button>
    </div>
  );
}

export default UploadButton;
