import React, { useState } from 'react';
import './Signup.css'; // Import CSS file for styling

export default function Signup() {
  // State variables to hold the form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Here you can perform validation and authentication
    // For simplicity, I'm just checking if fields are not empty and if passwords match
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      setMessage('Please fill in all fields.');
    } else if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
    } else {
      setMessage('Signup successful!');
      // You can redirect the user to another page or perform any other action upon successful signup
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}


