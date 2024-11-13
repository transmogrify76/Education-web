import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignmentPostPage.css'; // For custom styling
import Header from '../Header/Header';

const AssignmentPostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [classroomLink, setClassroomLink] = useState('');  // Changed from pdfUrl to classroomLink
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [error, setError] = useState('');

  // Fetch the class list on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('Failed to load classes.');
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data with the DTO structure
    const formData = {
      title,
      description,
      dueDate: new Date(dueDate),  // Ensure the dueDate is a Date object
      classroomLink: classroomLink || null,  // Handle PDF URL as classroomLink
      classId: parseInt(selectedClassId, 10),  // Ensure classId is an integer
    };

    try {
      await axios.post('http://localhost:3000/assignments', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Assignment created successfully!');
      // Reset form fields
      setTitle('');
      setDescription('');
      setDueDate('');
      setClassroomLink('');
      setSelectedClassId('');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment.');
    }
  };

  return (
    <div>
      <Header />

      <div className="assignment-form-container">
        <h2 className="form-title">Create Assignment</h2>
        {error && <p className="form-error">{error}</p>}
        <form className="assignment-form" onSubmit={handleSubmit}>
          
          {/* Class Selection Dropdown */}
          <div className="form-group">
            <label htmlFor="classDropdown" className="form-label">Select a Class:</label>
            <select
              id="classDropdown"
              className="class-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              required
            >
              <option value="">Select a class</option>
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.className} (ID: {classItem.id})
                  </option>
                ))
              ) : (
                <option value="" disabled>No classes available</option>
              )}
            </select>
          </div>

          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="titleInput" className="form-label">Title:</label>
            <input
              type="text"
              id="titleInput"
              className="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="descriptionTextarea" className="form-label">Description:</label>
            <textarea
              id="descriptionTextarea"
              className="description-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Due Date Input */}
          <div className="form-group">
            <label htmlFor="dueDateInput" className="form-label">Due Date:</label>
            <input
              type="date"
              id="dueDateInput"
              className="due-date-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Classroom Link Input (formerly PDF URL) */}
          <div className="form-group">
            <label htmlFor="classroomLinkInput" className="form-label">Classroom Link:</label>
            <input
              type="text"
              id="classroomLinkInput"
              className="classroom-link-input"
              value={classroomLink}
              onChange={(e) => setClassroomLink(e.target.value)}
              placeholder="Enter Classroom Link"
            />
          </div>

          <button type="submit" className="submit-button">Create Assignment</button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentPostPage;
