import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../Assets/logo.png';
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div href="/" className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="EDU Web Logo" className="navbar-logo" />
          <p className='tagline '>"padhega india tabhi toh badhega india"</p>
        </Link>
      </div>
      <div className="navbar-right">
        <a href="/Infrastructure">Infrastructure</a>
        <a href="/Curriculum">Curriculum</a>
        <a href="Award">Award</a>
        <a href="/Event">Event</a>
        <a href="Contactus">Contact Us</a>
        <a href="/Aboutus">About Us</a>
        <div className="dropdown">
          <div onClick={toggleDropdown} className="dropbtn">Log In</div>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/Login">Student</Link>
              <Link to="/Plogin">Parent</Link>
              <Link to="/tlogin">Teacher</Link>
              <Link to="/Adminregister">Admin</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
