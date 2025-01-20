import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherRegister.css';

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    password: ''
  });
  const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate();  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teacherData = {
      ...formData,
      roleType: 'teacher', 
      id: 2, // Static ID for now, can be dynamic if needed
      password: await hashPassword(formData.password)
    };
  
    const authToken = localStorage.getItem('authToken');  // Get token from localStorage or session
  
    try {
      const response = await fetch('http://localhost:3000/teacher/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,  // Include the Authorization token
        },
        body: JSON.stringify(teacherData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Registration successful:', result);
      setShowPopup(true);  
      setTimeout(() => {
        navigate('/tlogin');  
      }, 2000);
    } catch (error) {
      console.error('Error registering teacher:', error);
    }
  };
  

  const hashPassword = async (password) => {
    return password; // Simulating hashing, replace with actual hash function
  };

  return (
    <div className="teacher-register-container">
      <div className="teacher-register-card">
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
        {showPopup && (
          <div className="popup">
            <span className="popup-icon">✔</span>
            <span className="popup-message">Registration successful!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherRegister;
