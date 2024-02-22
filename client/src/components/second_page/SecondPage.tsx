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

  const handleDownload = () => {
    // Ensure the base64 string is properly formatted as a data URI
    //TODO: is this correct?
    const dataUri = image.data.startsWith('data:image') ? image.data : `data:image/jpeg;base64,${image.data}`;
  
    // Create a link element
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = image.filename || 'downloaded-image'; // Provide a default filename if necessary
  
    // Append to the document to ensure compatibility
    document.body.appendChild(link);
  
    // Create and dispatch a mouse event to simulate a click
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    link.dispatchEvent(event);
  
    // Clean up by removing the link
    document.body.removeChild(link);
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
            src={`data:image/jpeg;base64,${image.data}`}
            alt="Selected"
            onClick={() => setShowFullImage(true)}
          />
          {showFullImage && (
            <FullSizeImage
              image={image}
              onClose={() => setShowFullImage(false)}
            />)}
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
