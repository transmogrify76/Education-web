import React, { useState } from 'react';
import axios from 'axios';
import './Leave.css';

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
      const response = await axios.post('http://localhost:3000/leaves', leaveData); // Adjust the URL as needed
      setSuccess('Leave application submitted successfully!');
      setError('');
      // Reset form or handle successful submission here
    } catch (err) {
      setError('An error occurred while submitting the leave application.');
      setSuccess('');
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="container">
      <h1 className="heading">Student Leave Application</h1>
      <form onSubmit={handleSubmit} className="form-section">
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="rollNo">Roll No:</label>
          <input type="text" id="rollNo" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="class">Class:</label>
          <input type="text" id="class" value={class_} onChange={(e) => setClass(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="fromDate">From Date:</label>
          <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="toDate">To Date:</label>
          <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="reason">Reason:</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
        </div>
        <button type="submit" className="button-submit">Submit</button>
=======
    <div className="leave-container">
      <h1>Student Leave Application</h1>
      <form onSubmit={handleSubmit} className="leave-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-grou">
          <label htmlFor="rollNo">Roll No:</label>
          <input
            type="text"
            id="rollNo"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
        </div>
        <div className="form-grou">
          <label htmlFor="class">Class:</label>
          <input
            type="text"
            id="class"
            value={class_}
            onChange={(e) => setClass(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
>>>>>>> Stashed changes
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default Leave;
