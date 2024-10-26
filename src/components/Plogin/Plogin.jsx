import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Plogin.css';
import Header from '../Header/Header';
export default function Plogin() {
  const [email, setEmail] = useState('');
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

    if (email === '' || password === '') {
      setMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/parent/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token); // Store the token
        const parentId = data.parentId;
        setMessage('Login successful!');
        setIsLoggedIn(true);

        // Redirect to parent dashboard after successful login
        setTimeout(() => {
          navigate(`/dashboard/${parentId}`);
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
    localStorage.removeItem('authToken'); // Clear the auth token
    setIsLoggedIn(false);
    setMessage('You have logged out.');
  };

  return (
    <div>
      <Header />
    <div className="plogin-container">
      <div className="plogin-card">
        <h2>Parents Login</h2>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
        <div className="button-bottom">
          <div className="forgot-password-div" onClick={() => navigate('/forgetpassword')}>
            Forgot Password?
          </div>
        </div>
        <p className="message">{message}</p>
      </div>
    </div>
    </div>
  );
}
