import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure you have jwt-decode installed
import './TimeOffRequest.css';
import Header from '../Header/Header';
import Select from 'react-select'; // Import react-select for dropdown

const TimeOffRequest = () => {
  const [name, setName] = useState('');
  const [currentClass, setCurrentClass] = useState(''); // Current class
  const [newClass, setNewClass] = useState('');
  const [reason, setReason] = useState('');
  const [parentEmail, setParentEmail] = useState(''); // New state for parent email
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [studentOptions, setStudentOptions] = useState([]); // Options for students (children)
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student
  const [parentDetails, setParentDetails] = useState({}); // Parent details

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      const userIdFromToken = decodedToken.id;

      // Fetch parent details from API using parent ID
      axios.get(`http://192.168.0.103:3000/parent/${userIdFromToken}`)
        .then(response => {
          const parentData = response.data;
          setParentDetails(parentData); // Set parent details
          setParentEmail(parentData.email); // Set parent email

          // If there are children, set the children dropdown options
          if (parentData.students && parentData.students.length > 0) {
            const childrenOptions = parentData.students.map(child => ({
              value: child.id,
              label: `${child.name} (ID: ${child.id})`, // Include student ID in the label
            }));
            setStudentOptions(childrenOptions);
          }
        })
        .catch(error => {
          console.error('Error fetching parent details:', error);
          alert('Failed to fetch parent details');
        });
    }
  }, []);

  const handleStudentChange = async (selectedOption) => {
    setSelectedStudent(selectedOption);
    try {
      const response = await axios.get(`http://192.168.0.103:3000/student/${selectedOption.value}`);
      const studentData = response.data;
      setCurrentClass(studentData.class.className); // Update current class
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('Failed to fetch student details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://192.168.0.103:3000/transfer-requests', {
        name: selectedStudent ? selectedStudent.label.split(' (ID:')[0] : name, // Use selected student name if available
        currentClass,
        newClass,
        reason,
        parentEmail, // Include parentEmail in the request
      });

      if (response.status === 201) {
        setSuccessMessage('Transfer request submitted successfully!');
        setErrorMessage('');
        // Clear the form fields if needed
        setName('');
        setCurrentClass('');
        setNewClass('');
        setReason('');
        // Do not clear parentEmail as it is fetched from API
      }
    } catch (error) {
      setErrorMessage('Failed to submit transfer request. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <Header/>
      <div className="formContainer">
        <div className="formWrapper">
          <h1 className="formTitle">Transfer Request</h1>
          <form onSubmit={handleSubmit} className="form">
            <div className="formGroup">
              <label>Select a Student:</label>
              <Select
                options={studentOptions}
                value={selectedStudent}
                onChange={handleStudentChange}
                placeholder="Please select a student"
                isSearchable={false}
              />
            </div>
            {studentOptions.length === 0 && (
              <div className="formGroup">
                <label htmlFor="name" className="formLabel">Student Name:</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="formInput"
                  placeholder="Enter student name"
                />
              </div>
            )}
            <div className="formGroup">
              <label>Parent Email:</label>
              <input
                type="email"
                value={parentEmail}
                readOnly
                className="formInput"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="currentClass" className="formLabel">Current Class:</label>
              <input
                type="text"
                id="currentClass"
                value={currentClass}
                readOnly
                className="formInput"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="newClass" className="formLabel">New Class:</label>
              <input
                type="text"
                id="newClass"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                className="formInput"
                placeholder="Enter new class"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="reason" className="formLabel">Reason for Transfer:</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="formInput textarea"
                placeholder="Enter reason for transfer"
              ></textarea>
            </div>
            <button type="submit" className="submitButton">Submit</button>
            {successMessage && <p className="successMessage">{successMessage}</p>}
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimeOffRequest;
