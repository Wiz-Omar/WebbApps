import React, { useState } from 'react'

import logo from '../../assets/img/squid.png'

import './Navbar.css'
import UploadButton from './UploadButton'
import SortDropdown from './SortDropdown';
import SearchBar from './SearchBar/SearchBar';
import { Image} from '../../App';
import axios from 'axios';

interface NavbarProps {
  callback: (sortField?: string, sortOrder?: string) => void;
}

function Navbar({ callback }: NavbarProps) {

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top rounded bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" className="logo-img"></img>
          <span className="logo-text">PicPics</span>
        </a>
        <SearchBar/>
        <SortDropdown callback={callback} />
        <div className="d-flex">
          <UploadButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar