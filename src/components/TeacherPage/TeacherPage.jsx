import React, { useState, useEffect } from 'react';
import './TeacherPage.css';
import Header from '../Header/Header';

const TeacherPage = () => {
  const [events, setEvents] = useState([]);
  const [eventMessage, setEventMessage] = useState('');
  const [eventDescription, setEventDescription] = useState('');
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
      const response = await fetch('http://192.168.0.103:3000/notification');
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

  const handleEventDescriptionChange = (event) => {
    setEventDescription(event.target.value);
  };

  const handleEventDateChange = (event) => {
    setEventDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!eventMessage.trim() || !eventDate || !eventDescription.trim()) {
      setError('Message, description, and date are required');
      setLoading(false);
      return;
    }

    const postTime = new Date().toISOString();

    try {
      const response = await fetch('http://192.168.0.103:3000/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: eventMessage,
          description: eventDescription,
          date: eventDate,
          postTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post event');
      }

      setEventMessage('');
      setEventDescription('');
      setEventDate('');
      setSuccess(true);
      fetchEvents();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Disable delete for teachers by alerting no permission
  const handleDelete = async (id) => {
    alert('You do not have permission to delete notifications.');
  };

  return (
    <div>
      <Header />
      <div className="event-dashboard">
        <header className="title-bars">
          <div className="page-titles">Post Event</div>
        </header>
        <main className="page-content">
          <form onSubmit={handleSubmit} className="event-creator-form">
            <label htmlFor="eventMessage" className="form-label-text">
              Event Message
            </label>
            <textarea
              id="eventMessage"
              value={eventMessage}
              onChange={handleEventMessageChange}
              required
              className="textarea-input"
            ></textarea>
            <label htmlFor="eventDescription" className="form-label-text">
              Event Description
            </label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={handleEventDescriptionChange}
              required
              className="textarea-input"
            ></textarea>
            <label htmlFor="eventDate" className="form-label-text">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={handleEventDateChange}
              required
              className="date-input"
            />
            <button type="submit" className="submit-event-btn" disabled={loading}>
              {loading ? 'Posting...' : 'Post Event'}
            </button>
            {success && <p className="success-notification">Event posted successfully!</p>}
            {error && <p className="error-notification">Error: {error}</p>}
          </form>
          <div className="event-display">
            <h2>Existing Events</h2>
            {loading && <p>Loading events...</p>}
            {error && <p className="error-notification">Error: {error}</p>}
            {events.length === 0 ? (
              <p>No events available.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="event-card">
                  <p><strong>ID:</strong> {event.id}</p>
                  <p><strong>Message:</strong> {event.message}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Post Time:</strong> {event.postTime}</p>
                  {/* Delete button removed for teachers */}
                </div>
              ))
            )}
          </div>
        </main>
        <footer className="footer-section">
          <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default TeacherPage;
