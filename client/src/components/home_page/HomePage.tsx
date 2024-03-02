import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';


import Grid, { GridProps } from "./Grid";
import Navbar from "./HomeNavbar";

import "../../App.css";
import axios from "axios";

axios.defaults.withCredentials = true

export interface Image {
  id: number;
  filename: string;
  path: string;
  uploadDate: Date;
}

function HomePage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Call getImages and then set the state with the returned images
    async function fetchImages() {
      const fetchedImages = await getImages();
      setImages(fetchedImages);
    }

    fetchImages();
  }, [location.pathname]);

  async function getImages(sortField = "uploadDate", sortOrder = "desc") {
    try {
      setIsLoading(true);
      const response = await axios.get<Image[]>(
        `http://localhost:8080/image?sortField=${sortField}&sortOrder=${sortOrder}`
      );
      console.log(response.data);
      return response.data; // Return fetched images
    } catch (error) {
      console.error(error);
      return []; // Return empty array in case of an error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Navbar callback={getImages} />
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
