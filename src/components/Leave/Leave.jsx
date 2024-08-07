import React, { useState } from 'react';
import './Leave.css';

const Leave = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [class_, setClass] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      name,
      rollNo,
      class_,
      fromDate,
      toDate,
      reason
    });
  };

  return (
    <div className="container">
      <h1 className="heading">Student Leave Application</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-groups">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-groups">
          <label htmlFor="rollNo">Roll No:</label>
          <input type="text" id="rollNo" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
        </div>
        <div className="form-groups">
          <label htmlFor="class">Class:</label>
          <input type="text" id="class" value={class_} onChange={(e) => setClass(e.target.value)} />
        </div>
        <div className="form-groups">
          <label htmlFor="fromDate">From Date:</label>
          <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="form-groups">
          <label htmlFor="toDate">To Date:</label>
          <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div className="form-groups">
          <label htmlFor="reason">Reason:</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default Leave;
