import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leave.css';
import Header from '../Header/Header';
import {jwtDecode} from 'jwt-decode';

const Leave = () => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [class_, setClass] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');
  const [parentId, setParentId] = useState(null);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [leaveStatus, setLeaveStatus] = useState([]);

  // Load token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthToken(token);
        setParentId(decoded.id);
      } catch (err) {
        console.error('Invalid token:', err);
        setError('Invalid authentication token.');
      }
    } else {
      setError('No auth token found. Please log in.');
    }
  }, []);

  // Fetch student list for parent
  useEffect(() => {
    if (parentId && authToken) {
      const fetchStudents = async () => {
        try {
          const res = await axios.get(`http://192.168.0.103:3000/parent/${parentId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setStudents(res.data.students || []);
        } catch (err) {
          console.error('Error fetching students:', err);
          setError('Unauthorized access or failed to fetch students.');
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [parentId, authToken]);

  // Fetch leave status for parent
  useEffect(() => {
    if (parentId && authToken && month && year) {
      const fetchLeaveStatus = async () => {
        try {
          const res = await axios.get(`http://192.168.0.103:3000/leaves/for-parent`, {
            params: { parentId, month, year },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setLeaveStatus(res.data || []);
        } catch (err) {
          console.error('Error fetching leave status:', err);
          setError('Failed to fetch leave status.');
        }
      };

      fetchLeaveStatus();
    }
  }, [parentId, authToken, month, year]);

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);

    if (studentId) {
      try {
        const res = await axios.get(`http://192.168.0.103:3000/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const student = res.data;
        setName(student.name);
        setRollNo(student.enrollmentNo || '');
        setClass(student.class?.className || '');
        setError('');
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Could not load student details.');
      }
    } else {
      setName('');
      setRollNo('');
      setClass('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudentId) {
      setError('Please select a student.');
      return;
    }

    const leaveData = {
      name,
      rollNo,
      class: class_,
      fromDate,
      toDate,
      reason,
    };

    try {
      await axios.post('http://192.168.0.103:3000/leaves', leaveData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSuccess('Leave application submitted successfully!');
      setError('');
      setFromDate('');
      setToDate('');
      setReason('');
    } catch (err) {
      console.error('Error submitting leave:', err);
      setError('Unauthorized or failed to submit application.');
      setSuccess('');
    }
  };

  if (loading) return <p>Loading...</p>;

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
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} readOnly className="form-input" />
          </div>

          <div className="form-control">
            <label htmlFor="rollNo">Roll No:</label>
            <input type="text" id="rollNo" value={rollNo} readOnly className="form-input" />
          </div>

          <div className="form-control">
            <label htmlFor="class">Class:</label>
            <input type="text" id="class" value={class_} readOnly className="form-input" />
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

          <button type="submit" className="submit-button" disabled={!selectedStudentId}>
            Submit
          </button>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </form>

        {/* Month/Year Filter for Leave Status */}
        <div className="leave-status-filter">
          <h2>View Leave Status</h2>

          <div className="form-control">
            <label>Month:</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} required>
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label>Year:</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="">Select Year</option>
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Status List */}
          {leaveStatus.length > 0 ? (
            <ul className="leave-status-list">
              {leaveStatus.map((leave) => (
                <li key={leave.id} className="leave-status-item" style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                  <strong>Student:</strong> {leave.studentName} <br />
                  <strong>Reason:</strong> {leave.reason} <br />
                  <strong>Status:</strong> {leave.status} <br />
                  <strong>Leave Period:</strong>{' '}
                  {new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()} <br />
                  <strong>Parent:</strong> {leave.parentName} ({leave.parentEmail})
                </li>
              ))}
            </ul>
          ) : (
            month && year && <p>No leave records found for selected period.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leave;
