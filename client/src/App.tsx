import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/home_page/HomeNavbar";
import Grid from "./components/home_page/Grid";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecondPage from "./components/second_page/SecondPage";
import HomePage from "./components/home_page/HomePage";

export interface Image {
  id: number;
  filename: string;
  // stored as base64 string
  data: string;
  uploadDate: Date;
}

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getImages(sortField = "uploadDate", sortOrder = "desc") {
    try {
      setIsLoading(true);
      const response = await axios.get<Image[]>(
        `http://localhost:8080/image?sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const images = response.data;

      console.log(images.length);
      setImages(images);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getImages();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<HomePage images={images} callback={getImages} isLoading={isLoading}/>}
          />
          <Route 
            path="/second" 
            element={<SecondPage callback={getImages} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
