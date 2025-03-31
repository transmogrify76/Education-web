import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendancePage.css';
import Header from '../Header/Header';

const AttendancePage = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    className: '',
    date: '',
    present: false,
  });

  const [classNames, setClassNames] = useState([]);  // State for storing class names
  const [students, setStudents] = useState([]);  // State for storing students
  const [selectedClass, setSelectedClass] = useState('');  // Store the selected class id
  const [selectedStudent, setSelectedStudent] = useState('');  // Store the selected student id
  const [error, setError] = useState(null);

  // Fetch the class names from the backend
  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        console.log('Fetched class names:', response.data);  // Inspect the fetched data
        setClassNames(response.data);  // Set the class names here
      } catch (error) {
        console.error('There was an error fetching the class names:', error);
        setError('Failed to fetch class names.');
      }
    };

    fetchClassNames();
  }, []);  // Empty dependency array means it runs once when the component mounts

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Fetch students for the selected class
  const fetchStudentsForClass = async (classId) => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/class/${classId}`);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students for class:', error);
      setError('Failed to fetch students for this class.');
    }
  };

  // Handle class selection
  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);
    fetchStudentsForClass(selectedClassId);  // Fetch students based on the selected class
  };

  // Handle student selection
  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  // Handle attendance submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      studentId: selectedStudent,
      classId: selectedClass,
      date: formData.date,
      present: formData.present,
    };

    try {
      const response = await axios.post('http://192.168.0.103:3000/attendance', payload);
      console.log('Attendance submitted:', response.data);
      setError(null);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setError('Failed to submit attendance.');
    }
  };

  return (
    <div>
      <Header/>
    <div className="attendance-page">
      <h1 className="page-title">Mark Attendance</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} className="child-selection">
        <div className="select-class">
          <label htmlFor="classSelect">Select Class:</label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={handleClassChange}
            required
          >
            <option value="">--Select a Class--</option>
            {classNames.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}  {/* Access className directly */}
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div className="select-student">
            <label htmlFor="studentSelect">Select Student:</label>
            <select
              id="studentSelect"
              value={selectedStudent}
              onChange={handleStudentChange}
              required
            >
              <option value="">--Select a Student--</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="present">Present:</label>
          <input
            type="checkbox"
            id="present"
            name="present"
            checked={formData.present}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="scan-button">Submit Attendance</button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
    </div>
  );
};

export default AttendancePage;
