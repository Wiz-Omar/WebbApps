import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./SecondPage.css";
import DownloadIcon from "./DownloadIcon";
import CloseIcon from "./CloseIcon";
import DeleteIcon from "./DeleteIcon";
import { Image } from "../../App";
import IconButton from "../common/IconButton";
import FullSizeImage from "./FullSizeImg";

// SecondPage props
interface SecondPageProps {
  callback: () => void;
}

const SecondPage = ( {callback} : SecondPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { image, id } = location.state as { image: Image; id: number };

  const [showFullImage, setShowFullImage] = useState(false);

  // Handler to navigate back to the HomePage
  const handleClose = () => {
    navigate("/"); // Use '/' to navigate to the home page route
  };

  // Start a download to the users local machine
  // TODO: does not seem to work correctly
  const handleDownload = async () => {
    try {
      const link = document.createElement("a");
      const imageObj: Response = await fetch(image.url);
      const imageBlob: Blob = await imageObj.blob();
      link.href = URL.createObjectURL(imageBlob);
      link.download = image.filename;
      link.click();
    } catch (error: any){
      console.error('Could not fetch image', error);
    }
  };

  // TODO: Make sure await success before calling callback and navigating back!
  const handleDelete = async (image: Image, callback: () => void) => {
    try {
      const response = await fetch(`http://localhost:8080/image/${image.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        callback(); // Call the callback function to refetch the list of images
        navigate("/");
        console.log('Image deleted:', result);
        // You might want to do something here to update the UI accordingly
        // For example, removing the image from the state if you're keeping a list of images
      } else {
        console.error('Failed to delete image:', result.message);
      }
    } catch (error) {
      console.error('An error occurred while deleting the image:', error);
    }
  };

  return (
    <div className="container">
      <div className="row pt-5">
        <div className="col-9">
          <h1>
            <span className="file-label">File:</span>{" "}
            <span className="file-name">{image.filename}</span>
          </h1>
        </div>
        <div className="col-1">
          <IconButton Icon={DeleteIcon} ariaLabel="delete" onClick={() => handleDelete(image, callback)} />
        </div>
        <div className="col-1">
          <IconButton Icon={DownloadIcon} ariaLabel="download" onClick={handleDownload} />
        </div>
        <div className="col-1">
          <IconButton Icon={CloseIcon} ariaLabel="close" onClick={handleClose} />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 image-container">
        <img
            src={image.url}
            alt="Selected"
            onClick={() => setShowFullImage(true)}
          />
          {showFullImage && (
            <FullSizeImage
              imageUrl={image.url}
              onClose={() => setShowFullImage(false)}
            />)}
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
