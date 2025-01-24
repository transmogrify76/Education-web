import React, { useState } from 'react';
import axios from 'axios';

const AttendancePage = () => {
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [date, setDate] = useState('');
  const [present, setPresent] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();


    const studentId = getStudentIdByName(studentName);
    const classId = getClassIdByName(className);

    const payload = {
      studentId: studentId,
      classId: classId,
      date: date,
      present: present,
    };

    try {
      const response = await axios.post('http://localhost:3000/attendance', payload);
      setResponseData(response.data);
      setError(null);
    } catch (err) {
      setError('An error occurred while posting attendance.');
      setResponseData(null);
    }
  };

  // Dummy methods to simulate fetching IDs by names
  const getStudentIdByName = (name) => {
    const students = [
      { id: 6, name: 'Chitradeep Ghosh' }, // Example data
    ];
    const student = students.find((student) => student.name === name);
    return student ? student.id : null;
  };

  const getClassIdByName = (className) => {
    const classes = [
      { id: 2, name: 'Math' }, // Example data
    ];
    const classObj = classes.find((classItem) => classItem.name === className);
    return classObj ? classObj.id : null;
  };

  return (
    <div className="attendance-form">
      <h1>Mark Attendance</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="studentName">Student Name:</label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="className">Class:</label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="present">Present:</label>
          <input
            type="checkbox"
            id="present"
            checked={present}
            onChange={(e) => setPresent(e.target.checked)}
          />
        </div>
        <button type="submit">Submit Attendance</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {responseData && (
        <div className="response">
          <h3>Attendance Recorded</h3>
          <p>Date: {responseData.date}</p>
          <p>Student: {responseData.student.name}</p>
          <p>Class: {responseData.classEntity.className} - {responseData.classEntity.subject}</p>
          <p>Present: {responseData.present ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;