import React, { useState } from "react";

import logo from "../../../assets/img/squid.png";

import "./Navbar.css";
import UploadButton from "./UploadButton";
import SortDropdown from "./SortDropdown";
import SearchBar from "../SearchBar/SearchBar";
import { Image } from "../HomePage";
import axios from "axios";
import LikedToggle from "./LikedToggle";
import { Col, Container, Row } from "react-bootstrap";

interface NavbarProps {
  callback: (
    sortField?: string,
    sortOrder?: string,
    onlyLiked?: boolean
  ) => void;
}

/**
 * The Navbar component is used to display the navigation bar at the top of the page. It contains the logo, search bar, sort dropdown, liked toggle, and upload button.
 * The component uses the callback prop to update the sorting and filtering parameters when the user interacts with the sort dropdown, liked toggle, or upload button.
 */
function Navbar({ callback }: NavbarProps) {
  return (
    <Container fluid className="navbar-light sticky-top rounded bg-light">
      <Row className="mx-2">
        <Col xl={2} className="d-flex justify-content-center mb-2 align-items-center">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" className="logo-img"></img>
            <span className="logo-text">PicPics</span>
          </a>
        </Col>
        <Col xl={6} className="d-flex justify-content-center my-2 align-items-center">
          <SearchBar/>
        </Col>
        <Col xl={4} className="d-flex justify-content-center mb-2 align-items-center">
          <SortDropdown callback={callback} />
          <LikedToggle onToggle={callback} />
          <UploadButton callback={callback} />
        </Col>
      </Row>
    </Container>
  );
}

export default Navbar;
