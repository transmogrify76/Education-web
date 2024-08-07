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
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f2f2f2'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#333'
      }}>Student Leave Application</h1>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="rollNo" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Roll No:</label>
          <input type="text" id="rollNo" value={rollNo} onChange={(e) => setRollNo(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="class" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Class:</label>
          <input type="text" id="class" value={class_} onChange={(e) => setClass(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="fromDate" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>From Date:</label>
          <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="toDate" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>To Date:</label>
          <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="reason" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Reason:</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}></textarea>
        </div>
        <button type="submit" style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default Leave;
