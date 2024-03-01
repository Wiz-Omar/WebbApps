import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import "./SecondPage.css";
import DownloadIcon from "./Navbar/DownloadIcon";
import CloseIcon from "./Navbar/CloseIcon";
import DeleteIcon from "./Navbar/DeleteIcon";
import { Image } from "../../App";
import IconButton from "../common/IconButton";
import FullSizeImage from "./FullSizeImg";
import Navbar from "./Navbar/SecondNavbar";

// SecondPage props
interface SecondPageProps {
  callback: () => void;
}

const SecondPage = ( {callback} : SecondPageProps) => {
  const location = useLocation();
  const { image, id } = location.state as { image: Image; id: number };

  const [showFullImage, setShowFullImage] = useState(false);


  return (
    <div>
      <Navbar callback={ callback} />
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

 /*  return (
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
  ); */
};

export default SecondPage;
