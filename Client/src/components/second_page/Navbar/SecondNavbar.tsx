import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
import ConfirmationPopup from "../ConfirmationPopup";
import { handleDownload } from "../../../utils/handleDownload";
import { handleChangeName } from "../../../utils/handleChangeName";
import { Container, Row, Col } from "react-bootstrap";
import FilenameInput from "./FilenameInput";
import IconButtonsGroup from "./IconButtonsGroup";
import useDeleteImage from "../../../hooks/useDeleteImage";
import HomeLogo from "./HomeLogo";
import { Image } from "../../home_page/HomePage";

axios.defaults.withCredentials = true;

/**
 * The Navbar component is a component that renders the navbar of the second page.
 * It contains the logo, the filename, and the buttons to download, delete, and close the image.
 */
function Navbar() {
  const location = useLocation();
  const { image } = location.state as { image: Image };
  const navigate = useNavigate();

  const filenameParts = image.filename.split(".");
  const initialFilename = filenameParts.slice(0, -1).join("."); // Join all parts except the last one
  const fileExtension = filenameParts.pop() as string;

  let [newFilename, setNewFilename] = useState(initialFilename);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Custom hook to delete an image
  const { deleteImage } = useDeleteImage();

  // Event handler for the download button
  const handleDownloadClick = async () => {
    await handleDownload(image);
  };

  // Event handler for the delete button
  const handleDeleteClick = () => setShowDeletePopup(true);

  // Event handler for the confirm delete button
  const handleConfirmDelete = async () => {
    const response = await deleteImage(image.id.toString());
    if (!response.success) {
      setShowDeletePopup(false);
      alert("Failed to delete image");
    }
    setShowDeletePopup(false);
    navigate("/");
  };

  // Event handler for the cancel delete button
  const handleCancelDelete = () => setShowDeletePopup(false);

  // Event handler for the close button
  const handleClose = () => navigate("/");

  // Event handler for the rename input
  const handleRename = async (filename: string, fileExtension: string) => {
    await handleChangeName(image.id, filename, fileExtension);
    setNewFilename(filename);
  };

  return (
    <Container data-testid="second-navbar" fluid className="navbar-light sticky-top rounded bg-light">
      <Row className="mx-5">
        <Col
          md={2}
          className="d-flex justify-content-center mb-2 align-items-center"
        >
          <HomeLogo />
        </Col>
        <Col
          md={8}
          className="d-flex justify-content-center my-3 align-items-center"
        >
          <FilenameInput
            initialFilename={initialFilename}
            fileExtension={fileExtension}
            onRename={handleRename}
          />
        </Col>
        <Col
          md={2}
          className="d-flex justify-content-center mb-2 align-items-center"
        >
          <IconButtonsGroup
            onDownload={handleDownloadClick}
            onDelete={handleDeleteClick}
            onClose={handleClose}
          />
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
