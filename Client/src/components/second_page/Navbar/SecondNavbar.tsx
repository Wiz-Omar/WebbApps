import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../../assets/img/squid.png";

import "./Navbar.css";
import IconButton from "../../common/IconButton";
import { Image } from "../../home_page/HomePage";
import DeleteIcon from "../DeleteIcon";
import DownloadIcon from "../DownloadIcon";
import CloseIcon from "../CloseIcon";
import { handleDownload } from "../../../utils/handleDownload";

function Navbar() {
  const location = useLocation();
  const { image, id } = location.state as { image: Image; id: number };
  const navigate = useNavigate();

  // Handler to navigate back to the HomePage
  const handleClose = () => {
    navigate("/"); // Use '/' to navigate to the home page route
  };

  const handleDownloadClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await handleDownload(image);
    } catch (error) {
      console.error("An error occurred while downloading the image:", error);
      alert("An error occurred while downloading the image.");
    }
  };

  // TODO: Make sure await success before calling callback and navigating back!
  const handleDelete = async (image: Image) => {
    try {
      const response = await fetch(`http://localhost:8080/image/${image.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        navigate("/");
        console.log("Image deleted:", result);
        // You might want to do something here to update the UI accordingly
        // For example, removing the image from the state if you're keeping a list of images
      } else {
        console.error("Failed to delete image:", result.message);
      }
    } catch (error) {
      console.error("An error occurred while deleting the image:", error);
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
              onClick={() => handleDelete(image)}
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
    </nav>
  );
}

export default Navbar;
