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

function Navbar({ callback }: NavbarProps) {
  return (
    <Container fluid className="navbar-light sticky-top rounded bg-light">
      <Row>
        <Col md={2} className="d-flex justify-content-start mb-2 align-items-center">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" className="logo-img"></img>
            <span className="logo-text">PicPics</span>
          </a>
        </Col>
        <Col md={6} className="d-flex justify-content-center my-2 align-items-center">
          <SearchBar/>
        </Col>
        <Col md={4} className="d-flex justify-content-center mb-2 align-items-center">
          <SortDropdown callback={callback} />
          <LikedToggle onToggle={callback} />
          <UploadButton callback={callback} />
        </Col>
      </Row>
    </Container>
  );
}

export default Navbar;
