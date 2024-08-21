import React, { useState, useEffect } from 'react';
import './NotificationPage.css';
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/notification');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      console.log('Fetched notifications:', data);
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!message.trim()) {
      setError('Message cannot be empty');
      setLoading(false);
      return;
    }
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
      fetchNotifications(); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid notification ID');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(`Attempting to delete notification with ID: ${id}`); // Debugging line
      const response = await fetch(`http://localhost:3000/notification/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text(); // Read the response text for more details
        throw new Error(`Failed to delete notification: ${errorText}`);
      }
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
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
        <div className="notification-list">
          <h2>Existing Notifications</h2>
          {loading && <p>Loading notifications...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <p><strong>ID:</strong> {notification.id}</p>
                <p><strong>Message:</strong> {notification.message}</p>
                <button 
  onClick={() => handleDelete(notification.id)} 
  disabled={loading}
  className="delete-button"
>
  {loading ? 'Deleting...' : 'Delete'}
</button>
              </div>
            ))
          )}
        </div>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default NotificationPage;
