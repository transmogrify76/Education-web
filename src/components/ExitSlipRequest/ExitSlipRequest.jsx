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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
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
          const response = await fetch(`http://localhost:3000/parent/${parentId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch student data');
          }
          const data = await response.json();
          setStudents(data.students || []);
          setParentEmail(data.email || '');
          setFormData(prev => ({ ...prev, parentContact: data.email || '' }));
        } catch (error) {
          console.error('Error fetching student data:', error);
          setError('Failed to fetch student data.');
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [parentId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStudentChange = (e) => {
    const selectedStudentId = e.target.value;
    const selectedStudent = students.find(student => student.id === parseInt(selectedStudentId));
    setFormData(prev => ({
      ...prev,
      studentId: selectedStudentId,
      studentName: selectedStudent ? selectedStudent.name : '',
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, attachment: file }));
    } else {
      alert('Only PDF files are allowed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('studentId', formData.studentId);
    data.append('parentContact', formData.parentContact);
    data.append('studentName', formData.studentName);
    data.append('reason', formData.reason);
    data.append('date', formData.date);
    data.append('time', formData.time);
    data.append('attachment', formData.attachment);

    try {
      const response = await fetch('http://localhost:3000/exit-slip', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setSuccessMessage('Exit slip request submitted successfully.');
        setError(null);
      } else {
        const result = await response.json();
        console.error('Form submission failed', result);
        setError('Failed to submit the exit slip request.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('A network error occurred. Please try again later.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
      {student.name}  {/* Display only the name */}
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
          />
          <button type="submit" className="submit-button">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default ExitSlipRequest;
