import React, { useState } from 'react';
import './CounselingRequest.css';

const CounselingRequest = () => {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    email: '',
    phoneNo: '',
    reason: '',
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
      <h2 className="heading">Counseling Request</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
          placeholder="Parent's Name"
          className="input"
          required
        />
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          placeholder="Student's Name"
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="input"
          required
        />
        <input
          type="tel"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          placeholder="Phone Number"
          className="input"
          required
        />
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for Counseling"
          className="textarea"
          required
        />
        <button type="submit" className="submit-button">Submit Request</button>
      </form>
    </div>
  );
};

export default CounselingRequest;
