import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../Assets/logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // To store user type (student, parent, teacher, admin)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const storedUserType = localStorage.getItem('userType');
    if (token && storedUserType) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
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
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/Login', { replace: true });
  };

  const handleLoginNavigate = (role) => {
    localStorage.setItem('userType', role);
    switch (role) {
      case 'student':
        navigate('/Login');
        break;
      case 'parent':
        navigate('/Plogin');
        break;
      case 'teacher':
        navigate('/tlogin');
        break;
      case 'admin':
        navigate('/Adminregister');
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  const handleDashboardNavigate = () => {
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

  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-left-link">
          <p className="tagline">EDU WEB</p>
          <span className="digital-clock">{currentTime}</span>
        </a>
      </div>
      <div className="navbar-right">
        {/* Home Icon with text */}
        <a href="/" className="home-icon">
          <i className="fas fa-home"></i> Home
        </a>

        <a href="/Aboutus"><i className="fas fa-info-circle"></i> About Us</a>
        <a href="/Infrastructure"><i className="fas fa-building"></i> Infrastructure</a>
        <a href="/Curriculum"><i className="fas fa-book"></i> Curriculum</a>
        <a href="/Award"><i className="fas fa-award"></i> Award</a>
        <a href="/Event"><i className="fas fa-calendar-alt"></i> Event</a>
        <a href="/Contactus"><i className="fas fa-envelope"></i> Contact Us</a>

        {isLoggedIn && (
          <a href="#" onClick={handleDashboardNavigate} className="dashboard-button">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </a>
        )}

        {!isLoggedIn ? (
          <div className="dropdown">
            <div onClick={() => toggleDropdown('login')} className="dropbtn">
              Log In <i className="fas fa-chevron-down"></i>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <button className="login-button" onClick={() => handleLoginNavigate('student')}>
                  Student
                </button>
                <button className="login-button" onClick={() => handleLoginNavigate('parent')}>
                  Parent
                </button>
                <button className="login-button" onClick={() => handleLoginNavigate('teacher')}>
                  Teacher
                </button>
                <button className="login-button" onClick={() => handleLoginNavigate('admin')}>
                  Admin
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="dropdown">
            <div onClick={() => toggleDropdown('logout')} className="dropbtn">
              {userType === 'admin' ? 'Admin' : userType.charAt(0).toUpperCase() + userType.slice(1)} <i className="fas fa-chevron-down"></i>
            </div>
            {isLogoutConfirmationOpen && (
              <div className="dropdown-content logout-confirmation">
                <div className="logout-buttons">
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                  <button onClick={() => setIsLogoutConfirmationOpen(false)} className="cancel-button">
                    Cancel
                  </button>
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
