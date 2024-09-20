import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tlogin.css';
import Header from '../Header/Header';

export default function Tlogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === '' || password === '') {
      setMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/teacher/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Get the JSON response
        const teacherId = data.teacherId; // Extract the teacherId from the response

        localStorage.setItem('authToken', data.token); // Store the token
        setIsLoggedIn(true);
        setMessage('Login successful!');

        setTimeout(() => {
          navigate(`/TeacherDashboard/${teacherId}`); // Pass the teacherId in the URL
        }, 2000);
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
    localStorage.removeItem('authToken'); 
    setIsLoggedIn(false);
    setMessage('You have logged out.');
  };

  return (
    <div>
      <Header />
      <div className="tlogin-container">
        <div className="tlogin-card">
          <h2>{isLoggedIn ? 'Welcome Teacher' : 'Teacher Login'}</h2>
          {isLoggedIn ? (
            <div>
              <p>You are logged in.</p>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-groups">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <button className="submit" type="submit">Login</button>
            </form>
          )}
          <div className="forgot-password-div" onClick={() => navigate('/forgetpassword')}>
            Forgot Password?
          </div>
          <p className="message">{message}</p>
        </div>
      </div>
    </div>
  );
}
