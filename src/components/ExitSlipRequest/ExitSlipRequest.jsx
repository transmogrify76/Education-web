import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import './ExitSlipRequest.css';
import Header from '../Header/Header';

const ExitSlipRequest = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    reason: '',
    date: '',
    time: '',
    parentContact: '',
    attachment: null,
  });

  const [students, setStudents] = useState([]);
  const [parentEmail, setParentEmail] = useState('');
  const [parentId, setParentId] = useState(null);

  // For filtering exit slip history
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [exitSlipHistory, setExitSlipHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Decode parentId from JWT token on mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        setParentId(decodedToken.id);
      } catch (error) {
        console.error('Failed to decode authToken:', error);
      }
    }
  }, []);

  // Fetch students and parent email once parentId is known
  useEffect(() => {
    if (!parentId) return;

    const fetchParentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://192.168.0.103:3000/parent/${parentId}`);
        if (!response.ok) throw new Error('Failed to fetch parent data');
        const data = await response.json();
        setStudents(data.students || []);
        setParentEmail(data.email || '');
        setFormData(prev => ({ ...prev, parentContact: data.email || '' }));
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch parent data');
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [parentId]);

  // Fetch exit slip history whenever parentId, month or year changes
  useEffect(() => {
    if (!parentId || !selectedMonth || !selectedYear) {
      setExitSlipHistory([]);
      return;
    }

    const fetchExitSlipHistory = async () => {
      setLoading(true);
      try {
        const url = `http://192.168.0.103:3000/exit-slip/for-parent?parentId=${parentId}&month=${selectedMonth}&year=${selectedYear}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch exit slip history');
        const data = await response.json();
        setExitSlipHistory(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setExitSlipHistory([]);
        setError('Failed to fetch exit slip history.');
      } finally {
        setLoading(false);
      }
    };

    fetchExitSlipHistory();
  }, [parentId, selectedMonth, selectedYear]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle student dropdown change
  const handleStudentChange = async (e) => {
    const selectedStudentId = e.target.value;
    const selectedStudent = students.find(student => student.id === parseInt(selectedStudentId));

    setFormData(prev => ({
      ...prev,
      studentId: selectedStudentId,
      studentName: selectedStudent ? selectedStudent.name : '',
    }));
  };

  // Handle file input (PDF only)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, attachment: file }));
    } else {
      alert('Only PDF files are allowed');
    }
  };

  // Submit new exit slip request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('studentId', formData.studentId);
    data.append('parentContact', formData.parentContact);
    data.append('studentName', formData.studentName);
    data.append('reason', formData.reason);
    data.append('date', formData.date);
    data.append('time', formData.time);
    if(formData.attachment) data.append('attachment', formData.attachment);

    try {
      const response = await fetch('http://192.168.0.103:3000/exit-slip', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setSuccessMessage('Exit slip request submitted successfully.');
        setError(null);
        setFormData(prev => ({
          ...prev,
          reason: '',
          date: '',
          time: '',
          attachment: null,
        }));
      } else {
        const result = await response.json();
        console.error('Form submission failed:', result);
        setError('Failed to submit the exit slip request.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('A network error occurred. Please try again later.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="heading">Exit Slip Request</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleStudentChange}
            className="input"
            required
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Reason for Exit"
            className="textarea"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="text"
            name="parentContact"
            value={formData.parentContact}
            className="input"
            readOnly
            placeholder="Parent's Email"
          />
          <input
            type="file"
            name="attachment"
            onChange={handleFileChange}
            className="input"
            required
            accept="application/pdf"
          />
          <button type="submit" className="submit-button">Submit Request</button>
        </form>

        <hr />

        <div className="filter-section">
          <h3>Filter Exit Slip History</h3>
          <label>
            Month: 
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {[...Array(12).keys()].map(m => {
                const monthNum = m + 1;
                return (
                  <option key={monthNum} value={monthNum}>
                    {monthNum}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            Year: 
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {/* Example: last 5 years */}
              {Array.from({ length: 5 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        {exitSlipHistory.length > 0 ? (
          <div className="history-section">
            <h3>Exit Slip History</h3>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {exitSlipHistory.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.time}</td>
                    <td>{entry.reason}</td>
                    <td>{entry.status}</td>
                    <td>
                      {entry.attachment ? (
                        <a
                          href={`http://192.168.0.103:3000/${entry.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No exit slip history found for the selected month/year.</p>
        )}
      </div>
    </div>
  );
};

export default ExitSlipRequest;
