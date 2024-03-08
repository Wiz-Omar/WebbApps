import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

import Grid from "./Grid/Grid"; // Assuming GridProps are imported within Grid.js if needed
import Navbar from "./Navbar/HomeNavbar";

import "../../App.css";
import axios from "axios";

axios.defaults.withCredentials = true;

export interface Image {
  id: number;
  filename: string;
  path: string;
  uploadDate: Date;
}

function HomePage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<string>("uploadDate");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [onlyLiked, setOnlyLiked] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    getImages(); // This will use the current state values by default
  }, [location.pathname]);

  async function getImages(newSortField?: string, newSortOrder?: string, newOnlyLiked?: boolean) {
    // Update states if new values are provided, otherwise use current states
    const currentSortField = newSortField !== undefined ? newSortField : sortField;
    const currentSortOrder = newSortOrder !== undefined ? newSortOrder : sortOrder;
    const currentOnlyLiked = newOnlyLiked !== undefined ? newOnlyLiked : onlyLiked;

    // Update state only if new values are provided
    if (newSortField !== undefined) setSortField(newSortField);
    if (newSortOrder !== undefined) setSortOrder(newSortOrder);
    if (newOnlyLiked !== undefined) setOnlyLiked(newOnlyLiked);

    try {
      setIsLoading(true);
      const response = await axios.get<Image[]>(
        `http://localhost:8080/image?sortField=${currentSortField}&sortOrder=${currentSortOrder}&onlyLiked=${currentOnlyLiked}`
      );
      console.log(response.data);
      setImages(response.data);
    } catch (error) {
      console.error(error);
      return []; // Return empty array in case of an error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Navbar callback={(sf, so, ol) => getImages(sf, so, ol)} />
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <Grid images={images} callback={getImages} />
      )}
    </div>
  );
}

export default HomePage;
