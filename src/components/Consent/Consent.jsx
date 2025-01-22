import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Consent.css';
import Header from '../Header/Header';

const Consent = () => {
  const options = [
    { value: 'I give consent for field trips', label: 'Field Trips' },
    { value: 'I give consent for extracurricular activities', label: 'Extracurricular Activities' },
    { value: 'I give consent for photography use', label: 'Photography Use' },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const consentData = {
      parentName,
      studentName,
      email,
      phone,
      selectedOption: selectedOption.value,
    };

    try {
      await axios.post('http://localhost:3000/consent', consentData);
      alert('Consent form submitted successfully!');
    } catch (error) {
      console.error('Error submitting consent form:', error);
      alert('Failed to submit consent form');
    }
  };

  return (
    <div>
      <Header/>

    <div className="consent-form">
      <h2 className="head">Consent Form</h2>
      <p className="para">
        Dear Parent, for the information in the dropdown below, we require your consent.
      </p>
      <form onSubmit={handleSubmit} className="container">
        <div className="form-group">
          <label>Parent's Name:</label>
          <input
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Student's Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Select an Option:</label>
          <Select
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Please select"
            isSearchable={false}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default Consent;
