import React, { useState } from 'react';
import './ThirdPartyServices.css';

const ThirdPartyServices = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phoneNo: '',
    selectedServices: [],
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'selectedServices') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedServices: checked
          ? [...prevFormData.selectedServices, value]
          : prevFormData.selectedServices.filter((service) => service !== value),
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send formData to your API endpoint
    console.log('Form submitted', formData);
  };

  return (
    <div className="container">
      <h2 className="heading">Third Party Optional Services</h2>
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

        <div className="services">
          <label className="service-label">Select Services:</label>
          <div className="service-option">
            <input
              type="checkbox"
              name="selectedServices"
              value="Transport Service"
              onChange={handleChange}
              className="checkbox"
            />
            <label>Transport Service</label>
          </div>
          <div className="service-option">
            <input
              type="checkbox"
              name="selectedServices"
              value="Meal Plan"
              onChange={handleChange}
              className="checkbox"
            />
            <label>Meal Plan</label>
          </div>
          <div className="service-option">
            <input
              type="checkbox"
              name="selectedServices"
              value="Extra-Curricular Activities"
              onChange={handleChange}
              className="checkbox"
            />
            <label>Extra-Curricular Activities</label>
          </div>
        </div>

        <button type="submit" className="submit-button">Submit Request</button>
      </form>
    </div>
  );
};

export default ThirdPartyServices;
