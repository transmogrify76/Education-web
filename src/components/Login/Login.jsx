import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; 
import Header from '../Header/Header';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate(); 

  // Check if user is already logged in
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
      navigate('/StudentView', { replace: true }); // Redirect if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (username === '' || password === '') {
      setMessage('Please enter both username and password.');
      return;
    }

    try {
      // Send login request to the server
      const response = await fetch('http://192.168.0.103:3000/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentNo: username,  // Send student enrollment number as username
          password: password,
        }),
      });

      // Handle successful login
      if (response.ok) {
        const data = await response.json();  // Parse the response
        localStorage.setItem('authToken', data.token);  // Store JWT token
        const studentId = data.studentId;  // Assuming studentId is returned from the server (similar to parentId)
        setMessage('Login successful!');
        setIsLoggedIn(true);

        // Optionally, save any other necessary data to localStorage
        localStorage.setItem('studentId', studentId);

        // Redirect to student view after a short delay
        setTimeout(() => {
          navigate('/StudentView', { replace: true });
        }, 2000);  // Optional delay for showing the success message
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
      <div className="logins-container">
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-groups">
              <label htmlFor="username">Student ID</label>
              <input
                type="text"
                id="username"
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
          <div className="forgot-password-div" onClick={() => navigate('/forgetpassword')}>
            Forgot Password?
          </div>
          <p className="message">{message}</p>
        </div>
      </div>
    </div>
  );
}
