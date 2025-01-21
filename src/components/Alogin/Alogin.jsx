import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Alogin.css';
import Header from '../Header/Header';

export default function Alogin() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the admin is already logged in
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
      navigate('/admindashboard'); // Redirect if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (employeeId === '' || password === '') {
      setMessage('Please enter both Employee ID and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeNo: employeeId,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming the backend is returning the jwt_token key
        const jwtToken = data.jwt_token; // Fetch the JWT token from the response

        if (jwtToken) {
          // Storing jwt_token as authToken in localStorage
          localStorage.setItem('authToken', jwtToken);

          // Setting the logged-in status
          setIsLoggedIn(true);

          setTimeout(() => {
            navigate('/admindashboard'); // Redirect to admin page
          }, 2000);
        } else {
          setMessage('Login failed: No token received');
        }
      } else {
        const errorData = await response.json();
        setMessage(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the auth token
    setIsLoggedIn(false);
    setMessage('You have logged out.');
  };

  return (
    <div>
      <Header />
      <div className="Alogin-container">
        <div className="Alogin-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-groups">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
            <div className="input-groups">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn submit" type="submit">Login</button>
          </form>

          <div className="forgot-password-div" onClick={() => navigate('/forgetpassword')}>
            Forgot Password?
          </div>
          {isLoggedIn && (
            <div>
              <p>You are logged in.</p>
            </div>
          )}
          <p className="message">{message}</p>
        </div>
      </div>
    </div>
  );
}
