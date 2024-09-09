import React, { useEffect, useState } from 'react';
import './Event.css';
import Header from '../Header/Header';

const Event = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications data from the API
    fetch('http://localhost:3000/notification')
      .then(response => response.json())
      .then(data => {
        console.log('Notifications data:', data); // Debugging line
        setNotifications(data);
      })
      .catch(error => console.error('Error fetching notifications:', error));
  }, []);

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will format it as 'MM/DD/YYYY' by default
  };

  return (
    <div>
      <Header />
      <div className="events-page-container">
        <div className="header-container-event">
          <h1 className="header-titless">Upcoming Events & Holidays</h1>
        </div>
        <div className="main-contenter">
          <div className="events-container">
            <h2 className="section-title">Upcoming Events & Holidays</h2>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="notification-card">
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
        <footer className="footer">
          <p>&copy; 2024 Edu-Web. All rights reserved.</p>
          <p>
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Event;
