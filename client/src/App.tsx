import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecondPage from "./components/second_page/SecondPage/SecondPage";
import HomePage from "./components/home_page/HomePage";
import RegisterPage from "./components/login_page/RegisterPage";
//import LoginPage from "./components/LoginPage";
import LoginPage from "./components/login_page/LoginPage";

export enum AppDisplay {
  REGISTER_PAGE,
  LOGIN_PAGE,
  HOME_PAGE,
  ERROR_SCREEN,
}

function App() {
  const [appDisplay, setAppDisplay] = useState<AppDisplay>(
    AppDisplay.LOGIN_PAGE
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
    case AppDisplay.LOGIN_PAGE:
      return <LoginPage setDisplay={setDisplay} />;
    case AppDisplay.REGISTER_PAGE:
      return <RegisterPage setDisplay={setDisplay}/>;
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


