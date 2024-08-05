import React, { useState } from 'react';
import './Login.css'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === '' || password === '') {
      setMessage('Please enter both username and password.');
    } else {
      try {
        const response = await fetch('http://localhost:3000/student/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enrollmentNo: username,
            password: password,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          // Handle successful login
          setMessage(`Login successful! Welcome, ${responseData.name}.`); // Assuming response contains a name field
          // Redirect to a different page after successful login
          navigate('/studentdashboard'); // Adjust this route as needed
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
    <div className="logins-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Student ID</label>
            <input
              type="text"
              id="username"
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
        <div className="button-bottom">
          <button className="forgot-password-buttons" onClick={() => navigate('/forgetpassword')}>Forgot Password?</button>
        </div>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}
