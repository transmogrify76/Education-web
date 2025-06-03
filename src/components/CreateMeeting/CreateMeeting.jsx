import React, { useState, useEffect } from "react";
import axios from "axios";
import './CreateMeeting.css';
import Header from '../Header/Header';
import { jwtDecode } from 'jwt-decode';

const CreateMeeting = () => {
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [existingMeetingId, setExistingMeetingId] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [teacherId, setTeacherId] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherId(decoded.id);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchClassNames = async () => {
      if (!teacherId) return;

      try {
        const response = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`);
        const teacherClasses = response.data.classes || [];

        teacherClasses.sort((a, b) => {
          const aNum = parseInt(a.className.match(/\d+/));
          const bNum = parseInt(b.className.match(/\d+/));
          return aNum - bNum;
        });

        setClassNames(teacherClasses);
      } catch (error) {
        console.error('Error fetching class names:', error);
        setMessageType('error');
        setMessage("Failed to load class names. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassNames();
  }, [teacherId]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!selectedClass) return;

      try {
        const response = await axios.get(`http://192.168.0.103:3000/meeting/${selectedClass}`);

        // Handle both array or single object response
        if (Array.isArray(response.data)) {
          setMeetings(response.data);
          setExistingMeetingId(response.data[0]?.id || null);
        } else if (response.data && typeof response.data === "object") {
          setMeetings([response.data]);
          setExistingMeetingId(response.data.id);
        } else {
          setMeetings([]);
          setExistingMeetingId(null);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setMeetings([]);
        setExistingMeetingId(null);
      }
    };

    fetchMeetings();
  }, [selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setGoogleMeetLink("");
    setMeetingTitle("");
    setExistingMeetingId(null);
    setMessage("");
  };

  const handleGoogleMeetLinkChange = (e) => {
    setGoogleMeetLink(e.target.value);
  };

  const handleMeetingTitleChange = (e) => {
    setMeetingTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass || !googleMeetLink || !meetingTitle) {
      setMessageType('error');
      setMessage("Please select a class, enter a Google Meet link, and provide a meeting title.");
      return;
    }

    const googleMeetPattern = /^https:\/\/(meet\.google\.com\/[a-z0-9\-]+)/i;
    if (!googleMeetPattern.test(googleMeetLink)) {
      setMessageType('error');
      setMessage("Please enter a valid Google Meet link.");
      return;
    }

    try {
      if (existingMeetingId) {
        await axios.patch(`http://192.168.0.103:3000/meeting/${existingMeetingId}`, {
          googleMeetLink,
          title: meetingTitle,
        });
        setMessageType('success');
        setMessage("Meeting updated successfully!");
      } else {
        const response = await axios.post('http://192.168.0.103:3000/meeting', {
          classId: selectedClass,
          googleMeetLink,
          title: meetingTitle,
        });
        setExistingMeetingId(response.data.id);
        setMessageType('success');
        setMessage("Meeting created successfully!");
      }

      setGoogleMeetLink("");
      setMeetingTitle("");

      // Refresh meetings list
      setSelectedClass(selectedClass); // Triggers re-fetch
    } catch (error) {
      console.error("Error:", error);
      setMessageType('error');
      setMessage("Error creating or updating meeting. Please try again.");
    }
  };

  const getSelectedClassName = () => {
    const found = classNames.find(cls => cls.id.toString() === selectedClass);
    return found ? found.className : "";
  };

  return (
    <div>
      <Header />
      <section className="title-section">
        <h1 className="title">Create or Update a Virtual Meeting</h1>
        <p className="subtitle">Select a class and provide a Google Meet link to schedule or update a meeting.</p>
      </section>

      <div className="create-meeting-wrapper">
        <div className="input-group">
          <label htmlFor="class-dropdown" className="input-label">Select Class</label>
          <select
            id="class-dropdown"
            value={selectedClass}
            onChange={handleClassChange}
            className="input-select"
            disabled={isLoading}
          >
            <option value="">Select a class</option>
            {classNames.map((classItem) => (
              <option key={classItem.id} value={classItem.id.toString()}>
                {classItem.className}
              </option>
            ))}
          </select>
          {isLoading && <p className="loading-text">Loading classes...</p>}
        </div>

        {selectedClass && (
          <form onSubmit={handleSubmit} className="create-meeting-form">
            <div className="input-group">
              <label htmlFor="meetingTitle" className="input-label">Meeting Title</label>
              <input
                type="text"
                id="meetingTitle"
                value={meetingTitle}
                onChange={handleMeetingTitleChange}
                placeholder="Enter meeting title"
                required
                className="input-text"
              />
            </div>
            <div className="input-group">
              <label htmlFor="googleMeetLink" className="input-label">Google Meet Link</label>
              <input
                type="url"
                id="googleMeetLink"
                value={googleMeetLink}
                onChange={handleGoogleMeetLinkChange}
                placeholder="Enter Google Meet link"
                required
                className="input-url"
              />
            </div>
            <button type="submit" className="submit-button">
              {existingMeetingId ? "Update Meeting" : "Create Meeting"}
            </button>
          </form>
        )}

        <div className="meetings">
          {selectedClass && (
            <div>
              <h3>Meeting Schedules for Class: {getSelectedClassName()}</h3>
              {meetings.length > 0 ? (
                <div className="meeting-list">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="meeting-card">
                      <h4>{meeting.title}</h4>
                      <p>
                        <strong>Google Meet Link:</strong>{" "}
                        <a href={meeting.googleMeetLink} target="_blank" rel="noopener noreferrer">
                          Join Meeting
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No meetings available for this class.</p>
              )}
            </div>
          )}
        </div>

        {message && (
          <p className={`status-message ${messageType}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateMeeting;
