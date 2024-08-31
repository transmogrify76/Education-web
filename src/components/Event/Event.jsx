<<<<<<< Updated upstream
import React from 'react';
import { useLocation } from 'react-router-dom';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> Stashed changes
import './Event.css';
import Header from '../Header/Header';

const Event = () => {
<<<<<<< Updated upstream
    const location = useLocation();
    const { notification } = location.state || {}; // Get the notification data

    return (
        <div>
            <Header />
            <div className="events-page-container">
                <div className="header-container-event">
                    <h1 className="header-titles">Upcoming Events & Holidays</h1>
                </div>
                <div className="main-contenter">
                    <div className="events-container">
                        <h2 className="section-title">Upcoming Events</h2>
                        {notification && (
                            <div className="event-card">
                                <h3>{notification.title}</h3>
                                <p><strong>Date:</strong> {notification.date}</p>
                                <p>{notification.description}</p>
                            </div>
                        )}
                        {events.map((event, index) => (
                            <div key={index} className="event-card">
                                <h3>{event.title}</h3>
                                <p><strong>Date:</strong> {event.date}</p>
                                <p>{event.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="holidays-container">
                        <h2 className="section-title">Upcoming Holidays</h2>
                        {holidays.map((holiday, index) => (
                            <div key={index} className="holiday-card">
                                <h3>{holiday.title}</h3>
                                <p><strong>Date:</strong> {holiday.date}</p>
                                <p>{holiday.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <footer className="footer">
                    <p>&copy; 2024 Edu-Web. All rights reserved.</p>
                    <p>
                        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                    </p>
                </footer>
            </div>
=======
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    // Fetch events data from the API
    fetch('http://localhost:3000/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
      
    // Fetch holidays data from the API
    fetch('http://localhost:3000/holidays')
      .then(response => response.json())
      .then(data => setHolidays(data))
      .catch(error => console.error('Error fetching holidays:', error));
  }, []);

  return (
    <div>
      <Header />
      <div className="events-page-container">
        <div className="header-container-event">
          <h1 className="header-titles">Upcoming Events & Holidays</h1>
        </div>
        <div className="main-content">
          <div className="events-container">
            <h2 className="section-title">Upcoming Events</h2>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="event-card">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p>{event.description}</p>
                </div>
              ))
            ) : (
              <p>No events available at the moment.</p>
            )}
          </div>
          <div className="holidays-container">
            <h2 className="section-title">Upcoming Holidays</h2>
            {holidays.length > 0 ? (
              holidays.map((holiday) => (
                <div key={holiday.id} className="holiday-card">
                  <h3>{holiday.title}</h3>
                  <p><strong>Date:</strong> {holiday.date}</p>
                  <p>{holiday.description}</p>
                </div>
              ))
            ) : (
              <p>No holidays available at the moment.</p>
            )}
          </div>
>>>>>>> Stashed changes
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
