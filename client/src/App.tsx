import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecondPage from "./components/second_page/SecondPage";
import HomePage from "./components/home_page/HomePage";
import StartPage from "./components/StartPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";

export enum AppDisplay {
  START_PAGE,
  REGISTER_PAGE,
  LOGIN_PAGE,
  HOME_PAGE,
  ERROR_SCREEN,
}

function App() {
  const [appDisplay, setAppDisplay] = useState<AppDisplay>(
    AppDisplay.START_PAGE
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  function displayError(msg: string) {
    setErrorMsg(msg);
    setAppDisplay(AppDisplay.ERROR_SCREEN);
  }

  function setDisplay(display: AppDisplay) {
    setAppDisplay(display);
  }  

  switch (appDisplay) {
    case AppDisplay.START_PAGE:
      return <StartPage setDisplay={setDisplay} />;
    case AppDisplay.REGISTER_PAGE:
      return <RegisterPage setDisplay={setDisplay}/>;
    case AppDisplay.LOGIN_PAGE:
      return <LoginPage setDisplay={setDisplay}/>;
    case AppDisplay.HOME_PAGE:
      return (
        <div>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/second" element={<SecondPage />} />
              </Routes>
            </div>
          </Router>
        </div>
      );
    case AppDisplay.ERROR_SCREEN:
      return (
        <div>
          <h1>Error</h1>
          <p>{errorMsg}</p>
        </div>
      );
  }
}

export default App;


