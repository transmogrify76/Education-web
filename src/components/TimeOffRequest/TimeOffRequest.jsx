import React, { useState } from 'react';
import './TimeOffRequest.css';

const TimeOffRequest = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      name,
      startDate,
      endDate,
      reason
    });
  };

  return (
    <div className="container">
      <div className="form_main">
        <h1 className="heading">Time-Off Request</h1>
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
              placeholder="Name"
            ></textarea>
          </div>
          <div className="inputContainer">
            <span className="inputIcon">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="inputField"
            />
          </div>
          <div className="inputContainer">
            <span className="inputIcon">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="inputField"
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
              placeholder="Reason"
            ></textarea>
          </div>
          <button type="submit" id="button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TimeOffRequest;
