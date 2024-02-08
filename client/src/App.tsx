import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/Navbar";
import Grid from "./components/Grid";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecondPage from "./components/SecondPage";
import HomePage from "./HomePage";

export interface Image {
  id: number;
  filename: string;
  url: string;
  uploadDate: Date;
}

function App() {
  const [images, setImages] = useState<Image[]>([]);

  async function getImages() {
    setTimeout(async () => {
      try {
        const response = await axios.get<Image[]>(
          "http://localhost:8080/image/"
        );
        const images = response.data;
        setImages(images);
      } catch (error: any) {
        console.error(error);
      }
    }, 1000);
  }

  const imgs: string[] = [
    "https://via.placeholder.com/10",
    "https://via.placeholder.com/20",
    "https://via.placeholder.com/30",
    "https://via.placeholder.com/40",
    "https://via.placeholder.com/50",
    "https://via.placeholder.com/60",
    "https://via.placeholder.com/70",
    "https://via.placeholder.com/80",
    "https://via.placeholder.com/90",
  ];

  useEffect(() => {
    getImages();
    console.log(images.length);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage images={images} />} />
          <Route path="/second" element={<SecondPage callback={getImages}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
