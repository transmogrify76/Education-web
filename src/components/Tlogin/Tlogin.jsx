import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tlogin.css';
import Header from '../Header/Header';

export default function Tlogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (email === '' || password === '') {
      setMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.103:3000/teacher/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        // Store the token in localStorage
        localStorage.setItem('authToken', token);
        setMessage('Login successful');

        setTimeout(() => {
          // Redirect to the teacher's dashboard after successful login
          navigate('/teacherdashboard');
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

  return (
    <div>
      <Header />
      <div className="tlogin-container">
        <div className="tlogin-card">
          <h2>Teacher Login</h2>
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
