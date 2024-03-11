import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./SecondPage.css";
import { Image } from "../../home_page/HomePage";
import FullSizeImage from "../FullSizeImg/FullSizeImg";
import Navbar from "../Navbar/SecondNavbar";

/**
 * SecondPage component. The second page of the application, showing a single image. 
 * Uses Navbar and FullSizeImage components.
 */
function SecondPage(){
  const location = useLocation();
  const { image, id } = location.state as { image: Image; id: number };

  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="row mt-5">
        <div className="col-12 image-container">
        <img
            src={image.path}
            alt="Selected"
            onClick={() => setShowFullImage(true)}
          />
          {showFullImage && (
            <div data-testid="full-size-image-container">
            <FullSizeImage
              image={image}
              onClose={() => setShowFullImage(false)}
            />
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
