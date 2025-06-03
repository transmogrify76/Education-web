import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // fixed import, it should be default import
import './TimeOffRequest.css';
import Header from '../Header/Header';
import Select from 'react-select';

const TimeOffRequest = () => {
  // Existing states...
  const [name, setName] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [newClass, setNewClass] = useState('');
  const [reason, setReason] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [parentDetails, setParentDetails] = useState({});

  // New states for month/year and requests
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [requests, setRequests] = useState([]);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userIdFromToken = decodedToken.id;
      setParentId(userIdFromToken);

      axios.get(`http://192.168.0.103:3000/parent/${userIdFromToken}`)
        .then(response => {
          const parentData = response.data;
          setParentDetails(parentData);
          setParentEmail(parentData.email);

          if (parentData.students && parentData.students.length > 0) {
            const childrenOptions = parentData.students.map(child => ({
              value: child.id,
              label: `${child.name} (ID: ${child.id})`,
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
      setCurrentClass(studentData.class.className);
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('Failed to fetch student details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentId = selectedStudent ? selectedStudent.value : null;

    try {
      const response = await axios.post('http://192.168.0.103:3000/transfer-requests', {
        studentId,
        name: selectedStudent ? selectedStudent.label.split(' (ID:')[0] : name,
        currentClass,
        newClass,
        reason,
        parentEmail,
      });

      if (response.status === 201) {
        setSuccessMessage('Transfer request submitted successfully!');
        setErrorMessage('');
        setName('');
        setCurrentClass('');
        setNewClass('');
        setReason('');
      }
    } catch (error) {
      setErrorMessage('Failed to submit transfer request. Please try again.');
      setSuccessMessage('');
    }
  };

  // New function to fetch requests for parent by month/year
  const fetchRequestsByMonthYear = async () => {
    if (!parentId || !month || !year) {
      alert('Please select month and year.');
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.0.103:3000/transfer-requests/for-parent`,
        {
          params: {
            parentId,
            month,
            year,
          },
        }
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Failed to fetch transfer requests for the selected month and year.');
    }
  };

  // Helper to render the requests list
  const renderRequests = () => {
    if (requests.length === 0) return <p>No transfer requests found for this period.</p>;

    return (
      <table className="requestsTable">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Current Class</th>
            <th>New Class</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.currentClass}</td>
              <td>{req.newClass}</td>
              <td>{req.reason}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <Header />
      <div className="formContainer">
        <div className="formWrapper">
          <h1 className="formTitle">Transfer Request</h1>

          {/* Existing form for new transfer request */}
          <form onSubmit={handleSubmit} className="form">
            {/* Existing form groups here... (student select, current class, new class, etc) */}
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
              <input type="email" value={parentEmail} readOnly className="formInput" />
            </div>

            <div className="formGroup">
              <label htmlFor="currentClass" className="formLabel">Current Class:</label>
              <input type="text" id="currentClass" value={currentClass} readOnly className="formInput" />
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
              />
            </div>

            <button type="submit" className="submitButton">Submit</button>

            {successMessage && <p className="successMessage">{successMessage}</p>}
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          </form>

          <hr />

          {/* New UI for fetching requests by month and year */}
          <div className="formGroup">
            <h2>View Transfer Requests by Month and Year</h2>

            <label htmlFor="month">Month:</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="formInput"
            >
              <option value="">Select Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <label htmlFor="year" style={{ marginLeft: '1rem' }}>Year:</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2025"
              className="formInput"
              min="2000"
              max="2100"
              style={{ width: '100px', marginLeft: '0.5rem' }}
            />

            <button
              onClick={fetchRequestsByMonthYear}
              className="submitButton"
              style={{ marginLeft: '1rem' }}
            >
              Fetch Requests
            </button>
          </div>

          {/* Show fetched requests */}
          <div className="requestsContainer" style={{ marginTop: '2rem' }}>
            {renderRequests()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOffRequest;
