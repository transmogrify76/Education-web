import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherRegister.css';
import Header from '../Header/Header';

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    password: '',
    gender: '',
    subjects: [] // The subjects selected will be stored as an array
  });
  const [showPopup, setShowPopup] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]); // List to hold fetched subjects from the server
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subjects from the API
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://192.168.0.103:3000/subjects');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setSubjectsList(result); // Set the subjects list after fetching
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'subjects') {
      // Get all selected subjects from the dropdown
      const selectedSubjects = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({ ...formData, subjects: selectedSubjects }); // Update the formData with selected subjects
    } else {
      setFormData({ ...formData, [name]: value }); // For other fields
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare teacher data including selected subjects
    const teacherData = {
      ...formData,
      roleType: 'teacher',
      id: 2, // Static ID for now, can be dynamic if needed
      password: await hashPassword(formData.password),
    };

    const authToken = localStorage.getItem('authToken'); // Get the auth token from localStorage

    try {
      const response = await fetch('http://192.168.0.103:3000/teacher/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
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
        navigate('/tlogin'); // Redirect to login page after 2 seconds
      }, 2000);
    } catch (error) {
      console.error('Error registering teacher:', error);
    }
  };

  const hashPassword = async (password) => {
    return password; // Simulating password hashing, replace with actual hash function
  };

  return (
    <div>
      <Header />
    <div className="teacher-register-container">
      <div className="teacher-register-card">
        <h2>Teacher Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone No:
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Subjects:
            <select
              name="subjects"
              multiple
              value={formData.subjects} // Bind the value to the subjects array
              onChange={handleChange}
              required
            >
              {subjectsList.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
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
    </div>
  );
};

export default TeacherRegister;
