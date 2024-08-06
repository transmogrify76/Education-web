import React, { useState } from 'react';
import './ExitSlipRequest.css';

const ExitSlipRequest = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    reason: '',
    date: '',
    time: '',
    parentContact: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send formData to your API endpoint
    console.log('Form submitted', formData);
  };

  return (
    <div className="container">
      <h2 className="heading">Exit Slip Request</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          placeholder="Student's Name"
          className="input"
          required
        />
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for Exit"
          className="textarea"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="parentContact"
          value={formData.parentContact}
          onChange={handleChange}
          placeholder="Parent Contact Information"
          className="input"
          required
        />
        <button type="submit" className="submit-button">Submit Request</button>
      </form>
    </div>
  );
};

export default ExitSlipRequest;
