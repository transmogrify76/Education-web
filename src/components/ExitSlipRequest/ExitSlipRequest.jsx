import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ExitSlipRequest.css';
import Header from '../Header/Header';

const ExitSlipRequest = () => {
  const { parentId } = useParams();
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    reason: '',
    date: '',
    time: '',
    parentContact: '', // This will be set to the parent's email
  });

  const [students, setStudents] = useState([]);
  const [parentEmail, setParentEmail] = useState(''); // State to hold parent's email
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/parent/${parentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
        const data = await response.json();
        setStudents(data.students || []);
        setParentEmail(data.email || ''); // Assuming the parent's email is in the 'email' field
        setFormData({
          ...formData,
          parentContact: data.email || '' // Set parent contact info to email
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to fetch student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [parentId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStudentChange = (e) => {
    const selectedStudentId = e.target.value;
    const selectedStudent = students.find(student => student.id === parseInt(selectedStudentId));
    setFormData({
      ...formData,
      studentId: selectedStudentId,
      studentName: selectedStudent ? selectedStudent.name : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      studentId: formData.studentId,
      parentContact: formData.parentContact,
      studentName: formData.studentName,
      reason: formData.reason,
      date: formData.date,
      time: formData.time,
      status: 'Pending',
    };

    try {
      const response = await fetch('http://localhost:3000/exit-slip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Form submitted successfully', result);
      } else {
        console.error('Form submission failed', result);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Header/>
    <div className="container">
      <h2 className="heading">Exit Slip Request</h2>
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
              {student.name} (ID: {student.id})
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
          value={formData.parentContact} // Display parent's email
          className="input"
          readOnly
          placeholder="Parent's Email"
        />
        <button type="submit" className="submit-button">Submit Request</button>
      </form>
    </div>
          
    </div>
  );
};

export default ExitSlipRequest;
