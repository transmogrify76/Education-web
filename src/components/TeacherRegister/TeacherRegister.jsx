import React, { useState } from 'react';
import './TeacherRegister.css';

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teacherData = {
      ...formData,
      id: 1, // Assuming id is static for this example
      password: await hashPassword(formData.password)
    };

    try {
      const response = await fetch('http://localhost:3000/teacher/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Registration successful:', result);
    } catch (error) {
      console.error('Error registering teacher:', error);
    }
  };

  const hashPassword = async (password) => {
    // Simulating hashing function, replace with actual implementation
    return password;
  };

  return (
    <div className="teacher-register">
      <h2>Teacher Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Phone No:
          <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default TeacherRegister;
