import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/Navbar";
import Grid from "./components/Grid";
import GridImg from "./components/GridImg";

function App() {
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

  return (
    <div className="App">
      <Navbar></Navbar>
      <Grid images={imgs} />
    </div>
  );
}

export default App;
