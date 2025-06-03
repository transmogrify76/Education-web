import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './TransportRequest.css';
import Header from '../Header/Header';
import Select from 'react-select';

const TransportRequest = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    parentName: '',
    parentId: '',
    contactNumber: '',
    address: '',
    pickupLocation: '',
    dropoffLocation: '',
    additionalInfo: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [parentDetails, setParentDetails] = useState({});
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transportRequests, setTransportRequests] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch parent details and students on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userIdFromToken = decodedToken.id;

      axios.get(`http://192.168.0.103:3000/parent/${userIdFromToken}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        const parentData = response.data;
        setParentDetails(parentData);
        setFormData(prev => ({
          ...prev,
          parentName: parentData.name,
          parentId: parentData.id,
          contactNumber: parentData.phoneNo,
          address: parentData.address,
        }));

        if (parentData.students && parentData.students.length > 0) {
          const options = parentData.students.map(child => ({
            value: child.id,
            label: `${child.name} (ID: ${child.id})`,
          }));
          setStudentOptions(options);
        } else {
          setStudentOptions([]);
        }
      })
      .catch(() => {
        setError('Failed to fetch parent details.');
      });
    } catch {
      setError('Invalid token.');
    }
  }, []);

  // Fetch transport requests whenever parentDetails, selectedMonth or selectedYear change
  useEffect(() => {
    if (!parentDetails.id) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    axios.get(
      `http://192.168.0.103:3000/transport-request/for-parent?parentId=${parentDetails.id}&month=${selectedMonth}&year=${selectedYear}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(response => {
      setTransportRequests(response.data || []);
    })
    .catch(() => {
      setError('Failed to fetch transport requests.');
    });
  }, [parentDetails.id, selectedMonth, selectedYear]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = selectedOption => {
    setSelectedStudent(selectedOption);
    setFormData(prev => ({
      ...prev,
      studentName: selectedOption ? selectedOption.label.split(' (ID:')[0] : '',
      studentId: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    if (!selectedStudent && studentOptions.length > 0) {
      setError('Please select a student');
      return;
    }

    try {
      await axios.post(
        'http://192.168.0.103:3000/transport-request',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResponseMessage('Request submitted successfully!');
      setError('');
      setFormData({
        studentName: '',
        studentId: '',
        parentName: parentDetails.name,
        parentId: parentDetails.id,
        contactNumber: parentDetails.phoneNo,
        address: parentDetails.address,
        pickupLocation: '',
        dropoffLocation: '',
        additionalInfo: '',
      });
      setSelectedStudent(null);

      // Refresh transport requests after submit
      // Triggering effect by updating selectedMonth/year (can be improved)
      setTransportRequests(prev => [...prev]); // just a trigger
    } catch {
      setResponseMessage('');
      setError('Failed to submit request. Please try again.');
    }
  };

  // Get student name by id from studentOptions fallback
  const getStudentNameById = id => {
    const student = studentOptions.find(s => s.value === id);
    return student ? student.label.split(' (ID:')[0] : 'Unknown Student';
  };

  // Helpers for month and year dropdowns
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div>
      <Header />
      <div className="transport-request-container">
        <header className="transport-request-header">
          <h1>Transport Request</h1>
        </header>

        <section className="transport-request-content">
          <h2>Request a School Bus</h2>
          <form className="transport-form" onSubmit={handleSubmit}>
            <label>Parent/Guardian's Name:</label>
            <input
              type="text"
              value={formData.parentName}
              readOnly
              className="formInput"
            />

            <label>Select a Student:</label>
            <Select
              options={studentOptions}
              value={selectedStudent}
              onChange={handleStudentChange}
              placeholder="Please select a student"
              isSearchable={false}
            />

            {studentOptions.length === 0 && (
              <div>
                <label htmlFor="student-name">Student's Name:</label>
                <input
                  type="text"
                  id="student-name"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <label>Contact Number:</label>
            <input
              type="tel"
              value={formData.contactNumber}
              readOnly
              className="formInput"
            />

            <label>Address:</label>
            <input
              type="text"
              value={formData.address}
              readOnly
              className="formInput"
            />

            <label htmlFor="pickup-location">Pick-up Location:</label>
            <input
              type="text"
              id="pickup-location"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />

            <label htmlFor="dropoff-location">Drop-off Location:</label>
            <input
              type="text"
              id="dropoff-location"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              required
            />

            <label htmlFor="additional-info">Additional Information:</label>
            <textarea
              id="additional-info"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows="4"
            ></textarea>

            <button type="submit" className="btn">Submit Request</button>
          </form>

          {responseMessage && <p className="response-message">{responseMessage}</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="bus-info">
            <h3>Bus Timing and Charges</h3>
            <ul>
              <li><strong>Morning Pickup:</strong> 7:00 AM - 8:00 AM</li>
              <li><strong>Afternoon Drop-off:</strong> 4:30 PM - 6:00 PM</li>
              <li><strong>Charges:</strong> 3000 per month</li>
              <li><strong>Contact for Queries:</strong> transport@ourschool.edu</li>
            </ul>
          </div>

          {/* Month & Year selectors for filtering transport requests */}
          <div style={{ marginTop: '2rem' }}>
            <h3>Your Transport Requests</h3>

            <label htmlFor="month-select">Select Month: </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
            >
              {monthOptions.map(m => (
                <option key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <label htmlFor="year-select" style={{ marginLeft: '1rem' }}>Select Year: </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {transportRequests.length > 0 ? (
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table className="transport-requests-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Pickup Location</th>
                      <th>Dropoff Location</th>
                      <th>Additional Info</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transportRequests.map((req, index) => (
                      <tr key={index}>
                        {/* Use nested student object name */}
                        <td>{req.student?.name || getStudentNameById(req.student?.id)}</td>
                        <td>{req.pickupLocation}</td>
                        <td>{req.dropoffLocation}</td>
                        <td>{req.additionalInfo || 'N/A'}</td>
                        <td>{req.status || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ marginTop: '1rem' }}>No transport requests found for selected month/year.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransportRequest;
