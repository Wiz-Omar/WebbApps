import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../../assets/img/squid.png";

import './Navbar.css'
import IconButton from '../../common/IconButton';
import { Image } from "../../../components/home_page/HomePage";
import DeleteIcon from './DeleteIcon';
import DownloadIcon from './DownloadIcon';
import CloseIcon from './CloseIcon';

import axios from "axios";
import ConfirmationPopup from "../ConfirmationPopup";
import { handleDelete } from "../../../utils/handleDelete";
import { handleDownload } from "../../../utils/handleDownload";
axios.defaults.withCredentials = true;

function Navbar() {
  const location = useLocation();
  const { image } = location.state as { image: Image };
  const navigate = useNavigate();

  // Handler to navigate back to the HomePage
  const handleClose = () => {
    navigate("/"); // Use '/' to navigate to the home page route
  };

  const handleDownloadClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      await handleDownload(image);
    } catch (error) {
      console.error("An error occurred while downloading the image:", error);
      alert("An error occurred while downloading the image.");
    }
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleDeleteClick = () => {
    setShowDeletePopup(true); // Show the confirmation popup
  };

  const handleConfirmDelete = async () => {
    setShowDeletePopup(false); // Close the popup
    await onDelete(image); // Proceed with the deletion
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false); // Simply close the popup
  };

  const onDelete = async (image: Image) => {
    try {
      const response = await handleDelete(image.id);
      console.log("Image deleted successfully:", response.data.message);
      // Assuming navigate is available in this scope. If not, you might need to pass it as a parameter or use React Router's `useNavigate` hook
      navigate("/");
      // Optionally, update the UI here (e.g., removing the image from the state)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error with response from the server
        if (error.response) {
          console.error("Failed to delete image:", error.response.data);
          // Handle HTTP specific errors here (e.g., 400, 401, 500)
          if (error.response.status === 401) {
            alert("Cannot delete. User not logged in");
          } else if (error.response.status === 400) {
            alert("Invalid image ID");
          } else {
            alert("An error occurred while deleting the image");
          }
        } else {
          // Error related to setting up the request
          console.error("Error setting up the delete request:", error.message);
        }
      } else {
        // Non-Axios error
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Logo" className="logo-img mr-2"></img>
          <span className="logo-text">PicPics</span>
        </a>
        <div className="file-info-container text-center">
          <h1 className="mb-0">
            <span className="file-label">File:</span>{" "}
            <span className="file-name">{image.filename}</span>
          </h1>
        </div>
        <div className="icon-buttons-container d-flex align-items-center">
          <div className="mr-3">
            <IconButton
              Icon={DeleteIcon}
              ariaLabel="delete"
              onClick={handleDeleteClick} // Changed to show confirmation popup
            />
          </div>
          <div className="mr-3">
            <IconButton
              Icon={DownloadIcon}
              ariaLabel="download"
              onClick={handleDownloadClick}
            />
          </div>
          <div className="mr-3">
            <IconButton
              Icon={CloseIcon}
              ariaLabel="close"
              onClick={handleClose}
            />
          </div>
        </div>
      </div>
      <ConfirmationPopup
        isOpen={showDeletePopup}
        message="Are you sure you want to delete this image?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </nav>
  );
}

export default Navbar;
