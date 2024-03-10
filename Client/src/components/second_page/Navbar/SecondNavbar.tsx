import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/img/squid.png";
import "./Navbar.css";
import IconButton from "../../common/IconButton/IconButton";
import { Image } from "../../../components/home_page/HomePage";
import DeleteIcon from "./DeleteIcon";
import DownloadIcon from "./DownloadIcon";
import CloseIcon from "./CloseIcon";
import axios from "axios";
import ConfirmationPopup from "../ConfirmationPopup";
import { handleDelete } from "../../../utils/handleDelete";
import { handleDownload } from "../../../utils/handleDownload";
import { handleChangeName } from "../../../utils/handleChangeName";
import { Container, Row, Col } from "react-bootstrap";

axios.defaults.withCredentials = true;

/**
 * Navbar component for the second page. 
 * It displays the filename of the image and provides options to download, delete, and rename the image.
 * 
 */
function Navbar() {
  const location = useLocation();
  const { image } = location.state as { image: Image };
  const navigate = useNavigate();

  const filenameParts = image.filename.split(".");
  const initialFilename = filenameParts.slice(0, -1).join("."); // Join all parts except the last one
  const fileExtension = filenameParts.pop() as string;
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input element

  let [newFilename, setNewFilename] = useState(initialFilename);

  /** 
   * Handler to navigate back to the HomePage 
   */
  const handleClose = () => {
    navigate("/"); // Use '/' to navigate to the home page route
  };

  /**
   * Handler to download the image.
   */
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
    setShowDeletePopup(true); 
  };

  const handleConfirmDelete = async () => {
    setShowDeletePopup(false); 
    await onDelete(image); 
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false); 
  };

  /**
   * Handler to delete the image.
   */
  const onDelete = async (image: Image) => {
    try {
      const response = await handleDelete(image.id);
      console.log("Image deleted successfully:", response.data.message);
      navigate("/");
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
          console.error(
            "Error setting up the delete request:",
            error.message
          );
        }
      } else {
        // Non-Axios error
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  /**
   * Handler to change the filename of the image.
   */
  const handleChangeFilename = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilename = event.target.value;
    let newWidth = Math.max(Math.ceil(newFilename.length*(5/3)), 5); // Minimum width of 10%
    newWidth = Math.min(newWidth, 70); // Maximum width of 70%
    const inputElement = document.querySelector('.file-name-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.style.width = `${newWidth}%`;
    }
    let input = event.target.value;
    const specialCharsRegex = /[^a-zA-Z0-9-. ]/g;
    // Remove special characters from the input
    input = input.replace(specialCharsRegex, '');
    setNewFilename(input);
  };

  /**
   * Handler to change the filename of the image when the Enter key is pressed.
   */
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      try {
        let formattedFilename = newFilename;
        // Replace spaces with hyphens
        formattedFilename = formattedFilename.replace(/ /g, '-');
        // Replace multiple hyphens or dots in a row with a single one
        formattedFilename = formattedFilename.replace(/-+/g, '-').replace(/\.\.+/g, '.');
        // Remove hyphen or dot at the end of the string
        formattedFilename = formattedFilename.replace(/[-.]$/, '');

        if (formattedFilename !== '') {
          await handleChangeName(image.id, formattedFilename, fileExtension);
          newFilename = formattedFilename;
        } else {
          // TODO: Save the original filename somewhere and change it back to that?
          newFilename = initialFilename;
        }

        // Update newFilename if the request is successful
        setNewFilename(newFilename);

        // Remove focus from the input field
        inputRef.current?.blur(); // Using optional chaining to prevent error if inputRef.current is null

      } catch (error) {
        console.error("Error changing filename:", error);
        alert("An error occurred while changing the filename.");
      }
    }
  };


  return (
    <Container data-testid="second-navbar" fluid className="navbar-light sticky-top rounded bg-light">
      <Row className="mx-5">
        <Col md={2} className="d-flex justify-content-center mb-2 align-items-center">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" className="logo-img mr-2"></img>
            <span className="logo-text">PicPics</span>
          </a>
        </Col>
        <Col md={8} className="d-flex justify-content-center my-3 align-items-center" data-testid="file-name">
          <div className="file-info-container">
            <h1 className="mb-0">
              <span className="file-label">File:</span>{" "}
              <input
                ref={inputRef}
                type="text"
                className="file-name-input"
                value={newFilename}
                onChange={handleChangeFilename}
                onKeyDown={handleKeyDown}
                pattern="[a-zA-Z]+"
                title="Only letters, numbers, hyphens, dots, and spaces are allowed"
              />
            </h1>
          </div>
        </Col>
        <Col md={2} className="d-flex justify-content-center mb-2 align-items-center">
          <div className="icon-buttons-container d-flex align-items-center">
            <div className="mr-3">
              <IconButton
                Icon={DeleteIcon}
                ariaLabel="delete"
                onClick={handleDeleteClick}
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
        </Col>
      </Row>
      <ConfirmationPopup
        isOpen={showDeletePopup}
        message="Are you sure you want to delete this image?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
}

export default Navbar;
