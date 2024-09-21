import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; 
import Header from '../Header/Header';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/StudentView', { replace: true }); 
    }
  }, [navigate]);

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
        console.log('API Response:', responseData);

        localStorage.setItem('authToken', responseData.token);

        // Redirect to the student dashboard or profile page
        navigate(`/StudentView/${responseData.student.id}`, { replace: true }); // Replace history
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
