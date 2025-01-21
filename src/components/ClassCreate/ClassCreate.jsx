
import React, { useState } from 'react';
import axios from 'axios';
import './ClassCreate.css'; // Assuming you have a separate CSS file for styling
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

const ClassCreatePage = () => {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Retrieve token from localStorage
  const token = localStorage.getItem('authToken'); // 'authToken' is the key for the admin token

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the token exists, else show an error message
    if (!token) {
      setMessage('Authorization token not found. Please log in as an admin.');
      return;
    }

    const payload = {
      className,
      subject,
    };

    try {
      // Send a POST request to create the class with the token in the Authorization header
      const response = await axios.post(
        'http://localhost:3000/class',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        setClassName('');
        setSubject('');
        setSuccess('Class created successfully!');
        setError('');
        setMessage('');

        // Optionally, redirect after success (if needed)
        setTimeout(() => {
          navigate('/class-management'); // Redirect to class management page after success
        }, 2000); // Optional: delay before redirect
      } else {
        setError('Class create Successfully.');
        setSuccess('');
        setMessage('');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      // Check if the error is from the backend or network
      if (error.response) {
        // The request was made and the server responded with a status code
        setError(error.response.data.message || 'Failed to create class. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from the server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
      setSuccess('');
      setMessage('');
    }
  };

  return (
    <div>
      <Header />
      <div className="class-create-page">
        <h1>Create New Class</h1>

        <form className="class-form" onSubmit={handleSubmit}>
          <label htmlFor="className">Class Name:</label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />

          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <button type="submit" className="submit-button">
            Create Class
          </button>
        </form>

        {/* Conditional Rendering of Message */}
        {message && <p className="message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default ClassCreatePage;
