import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import './TimeOffRequest.css';

const TimeOffRequest = () => {
  const [name, setName] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [newClass, setNewClass] = useState('');
  const [reason, setReason] = useState('');
  const [parentEmail, setParentEmail] = useState(''); // New state for parent email
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/transfer-requests', {
        name,
        currentClass,
        newClass,
        reason,
        parentEmail, // Include parentEmail in the request
      });

      if (response.status === 201) {
        setSuccessMessage('Transfer request submitted successfully!');
        setErrorMessage('');
        // Clear the form fields if needed
        setName('');
        setCurrentClass('');
        setNewClass('');
        setReason('');
        setParentEmail(''); // Clear parentEmail field
      }
    } catch (error) {
      setErrorMessage('Failed to submit transfer request. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <h1 className="formTitle">Transfer Request</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label htmlFor="name" className="formLabel">Student Name:</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="formInput"
              placeholder="Enter student name"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="currentClass" className="formLabel">Current Class:</label>
            <input
              type="text"
              id="currentClass"
              value={currentClass}
              onChange={(e) => setCurrentClass(e.target.value)}
              className="formInput"
              placeholder="Enter current class"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="newClass" className="formLabel">New Class:</label>
            <input
              type="text"
              id="newClass"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="formInput"
              placeholder="Enter new class"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="reason" className="formLabel">Reason for Transfer:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="formInput textarea"
              placeholder="Enter reason for transfer"
            ></textarea>
          </div>
          <div className="formGroup">
            <label htmlFor="parentEmail" className="formLabel">Parent Email:</label>
            <input
              type="email"
              id="parentEmail"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="formInput"
              placeholder="Enter parent email"
            />
          </div>
          <button type="submit" className="submitButton">Submit</button>
          {successMessage && <p className="successMessage">{successMessage}</p>}
          {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default TimeOffRequest;
