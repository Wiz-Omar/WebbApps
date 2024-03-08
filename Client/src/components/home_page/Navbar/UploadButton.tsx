import React, { useRef } from "react";
import axios from "axios";
import { handleUpload } from "../../../utils/handleUpload";
import { validateFile } from "../../../utils/validateFile";
import { Upload } from "react-bootstrap-icons";
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
      validateFile(file);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    try {
      // If validateFile passes, we know that the file is a correctly formatted image
      await handleUpload(file as File);
      callback();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        // Duplicate filename error
        alert(error.response.data.message);
      } else if (error.response && error.response.status === 413) {
        // File too large error
        alert(error.response.data.message);
      } else if (error.response && error.response.status === 415) {
        // Unsupported file type error
        alert(error.response.data.message);
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
      />
      <button className="btn btn-primary" onClick={triggerFileInputClick}>
        <Upload /> Upload
      </button>
    </div>
  );
}

export default UploadButton;
