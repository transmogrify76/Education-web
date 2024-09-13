import React, { useState, useEffect } from 'react';
import './TeacherPage.css';
import Header from '../Header/Header';

const TeacherPage = () => {
  const [events, setEvents] = useState([]);
  const [eventMessage, setEventMessage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/notification'); 
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      console.log('Fetched events:', data);
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventMessageChange = (event) => {
    setEventMessage(event.target.value);
  };

  const handleEventDateChange = (event) => {
    setEventDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!eventMessage.trim() || !eventDate) {
      setError('Message and date are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: eventMessage, date: eventDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to post event');
      }

      setEventMessage('');
      setEventDate('');
      setSuccess(true);
      fetchEvents();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid event ID');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(`Attempting to delete event with ID: ${id}`); 
      const response = await fetch(`http://localhost:3000/notification/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to delete event: ${errorText}`);
      }
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== id)
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header/>
    <div className="event-post-container">
      <header className="header">
        <h1 className="header-title">Post Event</h1>
      </header>
      <main className="main-content">
        <form onSubmit={handleSubmit} className="event-form">
          <label htmlFor="eventMessage" className="form-label">Event Message</label>
          <textarea
            id="eventMessage"
            value={eventMessage}
            onChange={handleEventMessageChange}
            required
            className="form-textarea"
          ></textarea>
          <label htmlFor="eventDate" className="form-label">Event Date</label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={handleEventDateChange}
            required
            className="form-input"
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Posting...' : 'Post Event'}
          </button>
          {success && <p className="success-message">Event posted successfully!</p>}
          {error && <p className="error-message">Error: {error}</p>}
        </form>
        <div className="event-list">
          <h2>Existing Events</h2>
          {loading && <p>Loading events...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="event-item">
                <p><strong>ID:</strong> {event.id}</p>
                <p><strong>Message:</strong> {event.message}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <button 
                  onClick={() => handleDelete(event.id)} 
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
    </div>
  );
};

export default TeacherPage;
