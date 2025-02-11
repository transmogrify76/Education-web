import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../Assets/logo.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    // On component mount, check if there's an authToken in localStorage or sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    // If a token exists, consider the user logged in
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false); // Ensure it's logged out on reload if no token is found
    }
  }, []); // This effect only runs on mount

  const toggleDropdown = (type) => {
    if (type === 'login') {
      setIsDropdownOpen(!isDropdownOpen);
      setIsLogoutConfirmationOpen(false);
    } else if (type === 'logout') {
      setIsLogoutConfirmationOpen(!isLogoutConfirmationOpen);
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    // Get the authToken from localStorage or sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      // If no token is found, consider the user logged out directly
      setIsLoggedIn(false);
      navigate('/Login', { replace: true });
      return;
    }

    try {
      // Make a POST request to the logout API
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token in Authorization header
        },
      });

      if (response.ok) {
        // Logout was successful, clear localStorage and sessionStorage
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        
        setIsLoggedIn(false);

        // Navigate based on the user type
        const userType = localStorage.getItem('userType');
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
      } else {
        // If the response isn't ok, handle the error
        console.error('Logout failed:', response.statusText);
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      // Handle any network or server errors
      console.error('Logout error:', error);
      alert('Logout error. Please try again later.');
    }
  };

  const handleLoginNavigate = (role) => {
    // Navigate to the appropriate login page based on user role and set user type
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

  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="/">
          <img src={logo} alt="EDU Web Logo" className="navbar-logo" />
          <p className="tagline">"Padhega INDIA, Tabhi To Badhega INDIA"</p>
        </a>
      </div>
      <div className="navbar-right">
        {/* Home Icon */}
        <a href="/" className="home-icon">
          <i className="fas fa-home"></i>
        </a>
        <a href="/Aboutus">About Us</a>
        <a href="/Infrastructure">Infrastructure</a>
        <a href="/Curriculum">Curriculum</a>
        <a href="/Award">Award</a>
        <a href="/Event">Event</a>
        <a href="/Contactus">Contact Us</a>

        {/* Conditionally render the Dashboard button */}
        {isLoggedIn && (
          <a
            href="#"
            onClick={handleDashboardNavigate}
            className="dashboard-button"
          >
            Dashboard
          </a>
        )}

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
