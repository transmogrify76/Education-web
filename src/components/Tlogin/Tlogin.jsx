import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Tlogin.css';

export default function Tlogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === '' || password === '') {
      setMessage('Please enter both email and password.');
    } else {
      try {
        const response = await fetch('http://localhost:3000/teacher/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: username,
            password: password
          })
        });
        if (response.ok) {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate('/teacherpage'); // Redirect to teacher page after successful login
          }, 2000);
        } else {
          const errorData = await response.json();
          setMessage(`Login failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setMessage(`Error: ${error.message}`);
      }
    }
  }

  return (
    <div className="tlogin-container">
      <div className="tlogin-card">
        <h2>Welcome Teacher</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
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
        <div className="button-group">
          <button className="forgot-password-button">Forgot Password?</button>
        </div>
        <p className="message">{message}</p>
      </div>
      {showPopup && (
        <div className="popup">
          <span className="popup-icon">✔</span>
          <span className="popup-message">Login successful!</span>
        </div>
      )}
    </div>
  );
}
