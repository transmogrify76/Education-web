import React, { useEffect, useState } from 'react';
import './Event.css';
import Header from '../Header/Header';

const Event = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.103:3000/notification')
      .then(response => response.json())
      .then(data => {
        console.log('Notifications data:', data); // Debugging line
        setNotifications(data);
      })
      .catch(error => console.error('Error fetching notifications:', error));
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  return (
    <div>
      <Header />
      <div className="event-page-container">
        <div className="event-header-container">
          <h1 className="event-header-title">Upcoming Events & Holidays</h1>
        </div>
        <div className="event-main-content">
          <div className="event-list-container">
            <h2 className="event-section-title">Upcoming Events & Holidays</h2>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="event-notification-card">
                  <h3>{notification.message}</h3>
                  <p><strong>Date:</strong> {notification.date ? formatDate(notification.date) : 'No date provided'}</p>
                  <p><strong>Description:</strong> {notification.description || 'No description available'}</p>
                </div>
              ))
            ) : (
              <p>No notifications available at the moment.</p>
            )}
          </div>
        </div>
        <footer className="infra-footer">
                <p>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
                <p className="footer-text">© 2024 Edu-Web. All rights reserved.</p>
            </footer>
      </div>
    </div>
  );
};

export default Event;
