import React, { useState } from 'react';
import './Login.css'; 
import { useNavigate } from 'react-router-dom'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === '' || password === '') {
      setMessage('Please enter both username and password.');
      return;
    }

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
        console.log('API Response:', responseData); // Log the response data

        // Extract the student ID from the nested student object
        const studentId = responseData.student?.id; // Use optional chaining
        if (studentId) {
          setMessage(`Login successful! Welcome, ${responseData.student.name}.`);
          navigate(`/StudentView/${studentId}`);
        } else {
          setMessage('Student ID not found in response.');
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

  return (
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
        <div className="button-bottom">
          <button className="forgot-password" onClick={() => navigate('/forgetpassword')}>Forgot Password?</button>
        </div>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}
