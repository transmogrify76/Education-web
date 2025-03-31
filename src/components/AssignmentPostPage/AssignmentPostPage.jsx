import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignmentPostPage.css'; // For custom styling
import Header from '../Header/Header';

const AssignmentPostPage = () => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [classroomUrl, setClassroomUrl] = useState('');  
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ripple, setRipple] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch the class list on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        setClassList(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setErrorMessage('Failed to load classes.');
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate due date
    const selectedDate = new Date(assignmentDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    if (selectedDate < today) {
      alert('Please select a date that is today or in the future.');
      return;
    }

    setIsAnimating(true);

    // Create form data with the DTO structure
    const formData = {
      title: assignmentTitle,
      description: assignmentDescription,
      dueDate: new Date(assignmentDueDate),  
      classroomLink: classroomUrl || null,  
      classId: parseInt(selectedClassId, 10),  
    };

    try {
      await axios.post('http://192.168.0.103:3000/assignments', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Assignment created successfully!');
      // Reset form fields
      setAssignmentTitle('');
      setAssignmentDescription('');
      setAssignmentDueDate('');
      setClassroomUrl('');
      setSelectedClassId('');
      setIsAnimating(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment.');
      setIsAnimating(false);
    }
  };

  const handleRipple = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipple({ x, y });
    setTimeout(() => setRipple(null), 500);
  };

  return (
    <div>
      <Header />

      <div className="assignment-form-wrapper">
        <h2 className="assignment-header">Create Assignment</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="assignment-form-container" onSubmit={handleSubmit}>
          
          {/* Class Selection Dropdown */}
          <div className="form-field">
            <label htmlFor="classDropdown" className="field-label">Select a Class:</label>
            <select
              id="classDropdown"
              className="class-dropdown"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              required
            >
              <option value="">Select a class</option>
              {classList.length > 0 ? (
                classList.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.className}  
                  </option>
                ))
              ) : (
                <option value="" disabled>No classes available</option>
              )}
            </select>
          </div>

          {/* Title Input */}
          <div className="form-field">
            <label htmlFor="titleInput" className="field-label">Title:</label>
            <input
              type="text"
              id="titleInput"
              className="title-input-field"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-field">
            <label htmlFor="descriptionTextarea" className="field-label">Description:</label>
            <textarea
              id="descriptionTextarea"
              className="description-textarea-field"
              value={assignmentDescription}
              onChange={(e) => setAssignmentDescription(e.target.value)}
              required
            />
          </div>

          {/* Due Date Input */}
          <div className="form-field">
            <label htmlFor="dueDateInput" className="field-label">Due Date:</label>
            <input
              type="date"
              id="dueDateInput"
              className="due-date-input-field"
              value={assignmentDueDate}
              onChange={(e) => setAssignmentDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} 
              required
            />
          </div>

          {/* Classroom Link Input */}
          <div className="form-field">
            <label htmlFor="classroomLinkInput" className="field-label">Classroom Link:</label>
            <input
              type="text"
              id="classroomLinkInput"
              className="classroom-link-input-field"
              value={classroomUrl}
              onChange={(e) => setClassroomUrl(e.target.value)}
              placeholder="Enter Classroom Link"
            />
          </div>

          <button 
            type="submit" 
            className={`submit-assignment-button ripple-button ${isAnimating ? 'animating' : ''}`}
            onClick={handleRipple}
            disabled={isAnimating}
          >
            Create Assignment
            {ripple && (
              <span
                className="ripple"
                style={{
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                }}
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentPostPage;
