import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/Navbar";
import Grid from "./components/Grid";
import axios from "axios";

export interface Image {
  id: number;
  filename: string;
}

function App() {
  const [images, setImages] = useState<Image[]>([]);

  async function getImages() {
    setTimeout(async () => {
      try {
        const response = await axios.get<Image[]>(
          "http://localhost:8080/images"
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
  }, []);

  return (
    <div className="App">
      <Navbar></Navbar>
      <Grid images={images} />
    </div>
  );
}

export default App;
