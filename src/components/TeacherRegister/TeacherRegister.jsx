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
  const [errorMessage, setErrorMessage] = useState('');
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

        // Filter out duplicate subjects (case insensitive and trim whitespaces)
        const uniqueSubjectsMap = new Map();
        result.forEach(subject => {
          const subjectNameNormalized = subject.name.trim().toLowerCase(); // Normalize by trimming and converting to lowercase
          if (!uniqueSubjectsMap.has(subjectNameNormalized)) {
            uniqueSubjectsMap.set(subjectNameNormalized, subject);
          }
        });

        // Convert the Map back to an array
        setSubjectsList(Array.from(uniqueSubjectsMap.values())); // Set the unique subjects list after filtering
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setErrorMessage('Failed to load subjects. Please try again later.');
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

    const teacherData = {
      ...formData,
      roleType: 'teacher',
      id: 2, 
      password: await hashPassword(formData.password),
    };

    const authToken = localStorage.getItem('authToken'); 

    try {
      const response = await fetch('http://192.168.0.103:3000/teacher/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(teacherData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowPopup(true);
        setTimeout(() => {
          navigate('/admindashboard'); 
        }, 2000);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
        console.error('Error registering teacher:', data.message);
      }
    } catch (error) {
      console.error('Error registering teacher:', error);
      setErrorMessage('An error occurred while registering. Please try again later.');
    }
  };

  const hashPassword = async (password) => {
    return password; // No actual password hashing here, this is a placeholder.
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
                value={formData.subjects}
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
          {errorMessage && (
            <div className="error-message">
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
