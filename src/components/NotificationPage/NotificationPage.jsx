import React, { useState } from 'react';
import './NotificationPage.css';

const NotificationPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to post notification');
      }

      setMessage('');
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-post-container">
      <header className="header">
        <h1 className="header-title">Post Notification</h1>
      </header>
      <main className="main-content">
        <form onSubmit={handleSubmit} className="notification-form">
          <label htmlFor="message" className="form-label">Notification Message</label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            required
            className="form-textarea"
          ></textarea>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Posting...' : 'Post Notification'}
          </button>
          {success && <p className="success-message">Notification posted successfully!</p>}
          {error && <p className="error-message">Error: {error}</p>}
        </form>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotificationPage;
