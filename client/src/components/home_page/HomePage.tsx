import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Grid from "./Grid/Grid"; // Assuming GridProps are imported within Grid.js if needed
import Navbar from "./Navbar/HomeNavbar";

import "../../App.css";
import axios from "axios";
import { getImages } from "../../utils/getImages";
import { useImages } from "../../hooks/useImages";

axios.defaults.withCredentials = true;

export interface Image {
  id: number;
  filename: string;
  path: string;
  uploadDate: Date;
}

/**
 * The HomePage component fetches images from the server and displays them in a grid. Callbacks are used to update the sorting and filtering parameters.
 * The component uses the useImages hook to fetch images from the server.
 */
function HomePage() {
  const [sortField, setSortField] = useState<string>("uploadDate");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [onlyLiked, setOnlyLiked] = useState<boolean>(false);
  const [trigger, setTrigger] = useState(0); // Trigger state
  const location = useLocation();

  // Uses the custom hook useImages, passing a trigger state
  const { images, isLoading } = useImages({
    sortField,
    sortOrder,
    onlyLiked,
    pathname: location.pathname,
    trigger,
  });

  // Method to increment the trigger, causing the hook to re-execute
  const refreshImages = () => setTrigger((t) => t + 1);

  // Handle updates from Navbar or Grid
  const handleUpdate = (
    newSortField?: string,
    newSortOrder?: string,
    newOnlyLiked?: boolean
  ) => {
    if (newSortField !== undefined) setSortField(newSortField);
    if (newSortOrder !== undefined) setSortOrder(newSortOrder);
    if (newOnlyLiked !== undefined) setOnlyLiked(newOnlyLiked);

    // check if any of the parameters have changed, then refresh images
    if (
      newSortField !== sortField ||
      newSortOrder !== sortOrder ||
      newOnlyLiked !== onlyLiked
    ) {
      refreshImages();
    }
  };

  return (
    <div>
      <Navbar callback={handleUpdate} />
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <Grid images={images} callback={handleUpdate} />
      )}
    </div>
  );
}

export default HomePage;
