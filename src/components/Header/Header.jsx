import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../Assets/logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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


    const userType = localStorage.getItem('userType'); 

    localStorage.removeItem('userType');

    setIsLoggedIn(false);


    switch(userType) {
      case 'student':
        navigate('/Login', { replace: true });
        break;
      case 'parent':
        navigate('/Plogin', { replace: true });
        break;
      case 'teacher':
        navigate('/tlogin', { replace: true });
        break;
      case 'admin':
        navigate('/Adminregister', { replace: true });
        break;
      default:
        navigate('/Login', { replace: true }); 
        break;
    }
  };

  const handleLoginNavigate = (role) => {
    switch(role) {
      case 'student':
        localStorage.setItem('userType', 'student');
        navigate('/Login');
        break;
      case 'parent':
        localStorage.setItem('userType', 'parent');
        navigate('/Plogin');
        break;
      case 'teacher':
        localStorage.setItem('userType', 'teacher');
        navigate('/tlogin');
        break;
      case 'admin':
        localStorage.setItem('userType', 'admin');
        navigate('/Adminregister');
        break;
      default:
        break;
    }
    setIsDropdownOpen(false); 
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="/">
          <img src={logo} alt="EDU Web Logo" className="navbar-logo" />
          <p className="tagline">"পড়বে ইন্ডিয়া, তবেই তো বাড়বে ইন্ডিয়া"</p>
        </a>
      </div>
      <div className="navbar-right">
        <a href="/Aboutus">About Us</a>
        <a href="/Infrastructure">Infrastructure</a>
        <a href="/Curriculum">Curriculum</a>
        <a href="/Award">Award</a>
        <a href="/Event">Event</a>
        <a href="/Contactus">Contact Us</a>

        {!isLoggedIn ? (
          <div className="dropdown">
            <div onClick={() => toggleDropdown('login')} className="dropbtn">Log In</div>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <button className='login-button' onClick={() => handleLoginNavigate('student')}>Student</button>
                <button className='login-button' onClick={() => handleLoginNavigate('parent')}>Parent</button>
                <button className='login-button' onClick={() => handleLoginNavigate('teacher')}>Teacher</button>
                <button className='login-button' onClick={() => handleLoginNavigate('admin')}>Admin</button>
              </div>
            )}
          </div>
        ) : (
          <div className="dropdown">
            <div onClick={() => toggleDropdown('logout')} className="dropbtn">Log Out</div>
            {isLogoutConfirmationOpen && (
              <div className="dropdown-content logout-confirmation">
                <div className="logout-buttons">
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                  <button onClick={() => setIsLogoutConfirmationOpen(false)} className="cancel-button">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
