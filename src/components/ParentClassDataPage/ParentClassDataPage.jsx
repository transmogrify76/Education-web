import React, { useState, useEffect } from "react";
import axios from "axios";
import './ParentClassDataPage.css'; // Custom styles
import Header from '../Header/Header';

const ParentClassDataPage = () => {
  const [classNames, setClassNames] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClassName, setSelectedClassName] = useState(""); // Store class name
  const [meetingData, setMeetingData] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch class names when the component mounts
  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        setClassNames(response.data);
      } catch (error) {
        console.error('Error fetching class names:', error);
        setMessageType('error');
        setMessage("Failed to load class names. Please try again.");
      }
    };

    fetchClassNames();
  }, []);

  // Fetch meeting data when a class is selected
  useEffect(() => {
    const fetchMeetingData = async () => {
      if (selectedClassId) {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:3000/meeting/${selectedClassId}`);
          if (response.data && response.data.title) {
            setMeetingData([response.data]);
          } else if (Array.isArray(response.data) && response.data.length > 0) {
            setMeetingData(response.data);
          } else {
            setMessageType('warning');
            setMessage("No meetings available for this class.");
          }
        } catch (error) {
          setMessageType('error');
          setMessage("Failed to fetch meeting data.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMeetingData();
  }, [selectedClassId]);

  // Handle class selection
  const handleClassChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedClass = classNames.find(classItem => classItem.id === selectedId);
    setSelectedClassId(selectedId);
    setSelectedClassName(selectedClass ? selectedClass.className : ""); // Update class name
    setMessage("");
    setMeetingData([]);
  };

  return (
    <div>
      <Header />

      <div className="parent-class-data-page">
        <h1 className="page-header">Class Meeting Data</h1>
        <div className="input-group">
          <label htmlFor="class-dropdown" className="input-label">Select Class</label>
          <select
            id="class-dropdown"
            value={selectedClassId}
            onChange={handleClassChange}
            className="input-select"
            disabled={isLoading}
          >
            <option value="">Select a class</option>
            {classNames.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className} (ID: {classItem.id})
              </option>
            ))}
          </select>
          {isLoading && <p className="loading-text">Loading class data...</p>}
        </div>

        {message && (
          <p className={`status-message ${messageType}`}>
            {message}
          </p>
        )}

        {meetingData.length > 0 && (
          <div className="meeting-list">
            <h2>Meetings for {selectedClassName}</h2> {/* Display selected class name */}
            {meetingData.map((meeting) => (
              <div key={meeting.id} className="meeting-item">
                <h3>{meeting.title}</h3>
                <a href={meeting.googleMeetLink} target="_blank" rel="noopener noreferrer" className="join-link">
                  Join Google Meet
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentClassDataPage;
