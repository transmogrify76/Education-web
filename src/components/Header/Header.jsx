import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../Assets/logo.png';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (type) => {
    if (type === 'login') {
      setIsDropdownOpen(!isDropdownOpen);
      setIsLogoutConfirmationOpen(false); 
    } else if (type === 'logout') {
      setIsLogoutConfirmationOpen(!isLogoutConfirmationOpen);
      setIsDropdownOpen(false); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/', { replace: true });
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="EDU Web Logo" className="navbar-logo" />
          <p className="tagline">"padhega india tabhi toh badhega india"</p>
        </Link>
      </div>
      <div className="navbar-right">
        <a href="/Infrastructure">Infrastructure</a>
        <a href="/Curriculum">Curriculum</a>
        <a href="/Award">Award</a>
        <a href="/Event">Event</a>
        <a href="/Contactus">Contact Us</a>
        <a href="/Aboutus">About Us</a>
        <div className="dropdown">
          <div onClick={() => toggleDropdown('login')} className="dropbtn">Log In</div>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/Login">Student</Link>
              <Link to="/Plogin">Parent</Link>
              <Link to="/tlogin">Teacher</Link>
              <Link to="/Adminregister">Admin</Link>
            </div>
          )}
        </div>

        <div className="dropdown">
          <div onClick={() => toggleDropdown('logout')} className="dropbtn">Log Out</div>
          {isLogoutConfirmationOpen && (
            <div className="dropdown-content logout-confirmation">
              {/* <p>Are you sure you want to log out?</p> */}
              <div className="logout-buttons">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <button onClick={() => setIsLogoutConfirmationOpen(false)} className="cancel-button">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
