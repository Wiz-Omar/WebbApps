// Logo.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/img/squid.png';

/**
 * The Logo component is a simple component that renders the logo and the name of the application.
 * When clicked, it redirects the user to the home page.
 */
const HomeLogo: React.FC = () => (
  <Link to="/" className="navbar-brand">
    <img src={logo} alt="Logo" className="logo-img mr-2" />
    <span className="logo-text">PicPics</span>
  </Link>
);

export default HomeLogo;
