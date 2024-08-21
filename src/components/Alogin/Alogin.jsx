import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Alogin.css';

export default function Alogin() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (employeeId === '' || password === '') {
      setMessage('Please enter both Employee ID and password.');
    } else {
      try {
        const response = await fetch('http://localhost:3000/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            employeeNo: employeeId,
            password: password
          })
        });
        if (response.ok) {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate('/adminpage'); // Redirect to admin page after successful login
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
    <div className="Alogin-container">
      <div className="Alogin-card">
        <h2>Welcome Admin</h2>
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
        <div className="button-bottom">
                    <button className="forgot-password-buttons" onClick={() => navigate('/forgetpassword')}>Forgot Password?</button>
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
