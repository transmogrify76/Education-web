import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../Assets/logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

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

    if (!userType) {
      navigate('/Login', { replace: true });
      return;
    }

    switch (userType) {
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
    switch (role) {
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

  const handleDashboardNavigate = () => {
    const userType = localStorage.getItem('userType');
    if (userType) {
      switch (userType) {
        case 'student':
          navigate('/StudentView');
          break;
        case 'parent':
          navigate('/Dashboard');
          break;
        case 'teacher':
          navigate('/TeacherDashboard');
          break;
        case 'admin':
          navigate('/AdminDashboard');
          break;
        default:
          navigate('/Login');
          break;
      }
    } else {
      navigate('/Login');
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('menu-open', !isMenuOpen);
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <a href="/">
          <img src={logo} alt="EDU Web Logo" className="header-logo" />
        </a>
        <div>
          <p className="header-tagline">"Padhega INDIA, Tabhi To Badhega INDIA"</p>
        </div>
      </div>

      <div className="header-right">
        <div className="menu-icon" onClick={handleMenuToggle}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" className="home-icon-link">
            <i className="fas fa-home"></i>
          </a>
          <a href="/Aboutus" className="header-link">About Us</a>
          <a href="/Infrastructure" className="header-link">Infrastructure</a>
          <a href="/Curriculum" className="header-link">Curriculum</a>
          <a href="/Award" className="header-link">Award</a>
          <a href="/Event" className="header-link">Event</a>
          <a href="/Contactus" className="header-link">Contact Us</a>

          {isLoggedIn && (
            <a
              href="#"
              onClick={handleDashboardNavigate}
              className="dashboard-nav-button"
            >
              Dashboard
            </a>
          )}

          {!isLoggedIn ? (
            <div className="login-dropdown">
              <div onClick={() => toggleDropdown('login')} className="login-dropbtn">Log In</div>
              {isDropdownOpen && (
                <div className="login-dropdown-content">
                  <button className='login-role-button' onClick={() => handleLoginNavigate('student')}>Student</button>
                  <button className='login-role-button' onClick={() => handleLoginNavigate('parent')}>Parent</button>
                  <button className='login-role-button' onClick={() => handleLoginNavigate('teacher')}>Teacher</button>
                  <button className='login-role-button' onClick={() => handleLoginNavigate('admin')}>Admin</button>
                </div>
              )}
            </div>
          ) : (
            <div className="logout-dropdown">
              <div onClick={() => toggleDropdown('logout')} className="logout-dropbtn">Log Out</div>
              {isLogoutConfirmationOpen && (
                <div className="logout-dropdown-content logout-confirmation">
                  <div className="logout-btns-container">
                    <button onClick={handleLogout} className="confirm-logout-button">Logout</button>
                    <button onClick={() => setIsLogoutConfirmationOpen(false)} className="cancel-logout-button">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
