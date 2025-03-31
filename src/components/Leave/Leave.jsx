import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leave.css';
import Header from '../Header/Header';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode

const Leave = () => {
  const [name, setName] = useState('');
  const [enrollmentNo, setRollNo] = useState('');
  const [class_, setClass] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    // Get the authToken from localStorage
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Decode the token to get the parentId
        const decodedToken = jwtDecode(authToken);
        setParentId(decodedToken.id); // Extract parentId from the decoded token
      } catch (error) {
        console.error('Failed to decode authToken:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (parentId) {
      const fetchStudentData = async () => {
        try {
          const response = await axios.get(`http://192.168.0.103:3000/parent/${parentId}`);
          if (response.status !== 200) {
            throw new Error('Failed to fetch student data');
          }
          const data = response.data;
          setStudents(data.students || []);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching student data:', error);
          setError('Failed to fetch student data.');
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [parentId]);

  const handleStudentChange = async (e) => {
    const selectedStudentId = e.target.value;
    setSelectedStudentId(selectedStudentId);
    if (selectedStudentId) {
      try {
        const response = await axios.get(`http://192.168.0.103:3000/student/${selectedStudentId}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch student details');
        }
        const studentData = response.data;
        setName(studentData.name);
        setRollNo(studentData.enrollmentNo);
        setClass(studentData.class.className); // Accessing className instead of the entire class object
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    } else {
      setName('');
      setRollNo('');
      setClass('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leaveData = {
      name,
      enrollmentNo,
      class_,
      fromDate,
      toDate,
      reason
    };

    try {
      const response = await axios.post('http://192.168.0.103:3000/leaves', leaveData); // Adjust the URL as needed
      setSuccess('Leave application submitted successfully!');
      setError('');
      // Reset form or handle successful submission here
    } catch (err) {
      setError('An error occurred while submitting the leave application.');
      setSuccess('');
    }
  };

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="leave-app-container">
        <h1 className="leave-app-heading">Student Leave Application</h1>
        <form onSubmit={handleSubmit} className="leave-app-form">
          <div className="form-control">
            <label htmlFor="student">Select Student:</label>
            <select
              id="student"
              value={selectedStudentId}
              onChange={handleStudentChange}
              className="form-input"
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              readOnly
              className="form-input"
            />
          </div>
          <div className="form-control">
            <label htmlFor="rollNo">Enrolment No:</label>
            <input
              type="text"
              id="enrollmentNo"
              value={enrollmentNo}
              readOnly
              className="form-input"
            />
          </div>
          <div className="form-control">
            <label htmlFor="class">Class:</label>
            <input
              type="text"
              id="class"
              value={class_} // This now contains only the class name (e.g., "1")
              readOnly
              className="form-input"
            />
          </div>
          <div className="form-control">
            <label htmlFor="fromDate">From Date:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="toDate">To Date:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="reason">Reason:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-textarea"
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Submit</button>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Leave;
