import React, { useState } from 'react';
import './TimeOffRequest.css';

const TimeOffRequest = () => {
  const [name, setName] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [newClass, setNewClass] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      name,
      currentClass,
      newClass,
      reason
    });
  };

  return (
    <div className="container">
      <div className="form_main">
        <h1 className="heading">Transfer Request</h1>
        <form onSubmit={handleSubmit}>
          <div className="inputContainer">
            <span className="inputIcon">
              <i className="fas fa-user"></i>
            </span>
            <textarea
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputField textarea"
              placeholder="Student Name"
            ></textarea>
          </div>
          <div className="inputContainer">
            <span className="inputIcon">
              <i className="fas fa-school"></i>
            </span>
            <input
              type="text"
              id="currentClass"
              value={currentClass}
              onChange={(e) => setCurrentClass(e.target.value)}
              className="inputField"
              placeholder="Current Class"
            />
          </div>
          <div className="inputContainer">
            <span className="inputIcon">
              <i className="fas fa-school"></i>
            </span>
            <input
              type="text"
              id="newClass"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="inputField"
              placeholder="New Class"
            />
          </div>
          <div className="inputContainer">
            <span className="inputIcon">
              <i className="fas fa-comment"></i>
            </span>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="inputField textarea"
              placeholder="Reason for Transfer"
            ></textarea>
          </div>
          <button type="submit" id="button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TimeOffRequest;
