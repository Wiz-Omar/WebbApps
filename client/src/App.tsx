import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/home_page/Navbar";
import Grid from "./components/home_page/Grid";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecondPage from "./components/second_page/SecondPage";
import HomePage from "./components/home_page/HomePage";

export interface Image {
  id: number;
  filename: string;
  url: string;
  uploadDate: Date;
}

function App() {
  const [images, setImages] = useState<Image[]>([]);

  async function getImages(sortField = "filename", sortOrder = "asc") {
    try {
      console.log("Getting images");
      const response = await axios.get<Image[]>(
        `http://localhost:8080/image?sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const images = response.data;
      setImages(images);
    } catch (error) {
      console.error(error);
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
            element={<HomePage images={images} callback={getImages} />}
          />
          <Route path="/second" element={<SecondPage callback={getImages} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
