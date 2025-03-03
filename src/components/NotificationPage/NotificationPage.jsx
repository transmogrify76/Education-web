import React, { useState, useEffect } from 'react';
import './NotificationPage.css';
import Header from '../Header/Header';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
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
      const response = await fetch('http://192.168.0.103:3000/notification');
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

  const handleMessageChange = (event) => setMessage(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!message.trim() || !date.trim()) {
      setError('Message and Date cannot be empty');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://192.168.0.103:3000/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, date, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to post notification');
      }
      setMessage('');
      setDate('');
      setDescription('');
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
      const response = await fetch(`http://192.168.0.103:3000/notification/${id}`, {
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
    <div className="notification-page">
      <Header />
      <div className="notification-page__post-container">
        <header className="notification-page__header">
          <h1 className="notification-page__title">Post Notification</h1>
        </header>
        <main className="notification-page__main-content">
          <form onSubmit={handleSubmit} className="notification-page__form">
            <label htmlFor="message" className="notification-page__label">Notification Message</label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              required
              className="notification-page__textarea"
            ></textarea>
            <label htmlFor="date" className="notification-page__label">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              required
              className="notification-page__input"
            />
            <label htmlFor="description" className="notification-page__label">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="notification-page__textarea"
            ></textarea>
            <button type="submit" className="notification-page__submit-button" disabled={loading}>
              {loading ? 'Posting...' : 'Post Notification'}
            </button>
            {success && <p className="notification-page__success-message">Notification posted successfully!</p>}
            {error && <p className="notification-page__error-message">Error: {error}</p>}
          </form>
          <div className="notification-page__list">
            <h2 className="notification-page__list-title">Existing Notifications</h2>
            {loading && <p className="notification-page__loading-message">Loading notifications...</p>}
            {error && <p className="notification-page__error-message">Error: {error}</p>}
            {notifications.length === 0 ? (
              <p className="notification-page__no-notifications">No notifications available.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="notification-page__item">
                  <p><strong>ID:</strong> {notification.id}</p>
                  <p><strong>Message:</strong> {notification.message}</p>
                  <p><strong>Date:</strong> {new Date(notification.date).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {notification.description || 'N/A'}</p>
                  <button 
                    onClick={() => handleDelete(notification.id)} 
                    disabled={loading}
                    className="notification-page__delete-button"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
        <footer className="notification-page__footer">
          <p className="notification-page__footer-text">© 2024 Edu_Web. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default NotificationPage;
