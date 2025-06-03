import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from '../Header/Header';
import './ParentClassDataPage.css'; // Add your styles here

const ParentClassDataPage = () => {
  const [studentClassId, setStudentClassId] = useState('');
  const [className, setClassName] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Decode token and extract student's class ID
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const classId = decoded.class?.id;
        const className = decoded.class?.className;
        setStudentClassId(classId);
        setClassName(className);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setMessageType('error');
        setMessage('Invalid session. Please log in again.');
        setLoading(false);
      }
    }
  }, []);

  // Fetch meetings for the student's class
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!studentClassId) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://192.168.0.103:3000/meeting/${studentClassId}`);
        if (Array.isArray(response.data)) {
          setMeetings(response.data);
        } else if (response.data && typeof response.data === 'object') {
          setMeetings([response.data]);
        } else {
          setMeetings([]);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setMessageType('error');
        setMessage('Failed to fetch meeting data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [studentClassId]);

  return (
    <div>
      <Header />
      <div className="student-meeting-page">
        <h1 style={{ color: '#ffffff', textAlign: 'center' }}>Virtual Class Meetings</h1>

        {className && (
          <p className="class-info">Showing meetings for Class <strong>{className}</strong></p>
        )}

        {loading ? (
          <p>Loading meetings...</p>
        ) : (
          <>
            {message && <p className={`status-message ${messageType}`}>{message}</p>}

            {meetings.length > 0 ? (
              <div className="meeting-list">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="meeting-card">
                    <h3>{meeting.title}</h3>
                    <p>
                      <strong>Google Meet:</strong>{' '}
                      <a href={meeting.googleMeetLink} target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No meetings available for your class.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ParentClassDataPage;
