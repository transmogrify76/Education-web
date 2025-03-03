import React, { useState } from 'react';
import axios from 'axios';
import './Leave.css';
import Header from '../Header/Header';

const Leave = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [class_, setClass] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leaveData = {
      name,
      rollNo,
      class_,
      fromDate,
      toDate,
      reason
    };

    try {
      const response = await axios.post('http://192.168.0.103:3000/leaves', leaveData); // Adjust the URL as needed
      setSuccess('Leave application submitted successfully!');
      setError('');
      // Reset form or handle successful submission here
    } catch (err) {
      setError('An error occurred while submitting the leave application.');
      setSuccess('');
    }
  };

  return (
    <div>
      <Header/>
    <div className="leave-app-container">
      <h1 className="leave-app-heading">Student Leave Application</h1>
      <form onSubmit={handleSubmit} className="leave-app-form">
        <div className="form-control">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-control">
          <label htmlFor="rollNo">Enrolment No:</label>
          <input
            type="text"
            id="rollNo"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-control">
          <label htmlFor="class">Class:</label>
          <input
            type="text"
            id="class"
            value={class_}
            onChange={(e) => setClass(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-control">
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-control">
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-control">
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-textarea"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Submit</button>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </form>
    </div>
    </div>
  );
};

export default Leave;
