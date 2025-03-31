import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  
import './TeacherStudentManagementPage.css';
import Header from '../Header/Header';

const TeacherStudentManagementPage = () => {
  const [classNames, setClassNames] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [studentIdToAdd, setStudentIdToAdd] = useState('');
  const [classIdToAdd, setClassIdToAdd] = useState('');
  const [studentIdToRemove, setStudentIdToRemove] = useState('');
  const [classIdToRemove, setClassIdToRemove] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const isTokenValid = (token) => {
    if (!token) return false;
    const decodedToken = jwtDecode(token);  
    const currentTime = Date.now() / 1000; 
    return decodedToken.exp > currentTime;  
  };

  useEffect(() => {
    if (authToken && isTokenValid(authToken)) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      console.error('Token is invalid or expired');
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        setClassNames(response.data);
      } catch (error) {
        console.error('There was an error fetching the class names:', error);
      }
    };
    fetchClassNames();
  }, []);
  useEffect(() => {
    const fetchStudentsByClass = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(`http://192.168.0.103:3000/management/students/class/${selectedClassId}`);
          setStudents(response.data);
        } catch (error) {
          console.error('There was an error fetching the students:', error);
        }
      } else {
        setStudents([]); 
      }
    };
    fetchStudentsByClass();
  }, [selectedClassId]);
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(`http://192.168.0.103:3000/class/${selectedClassId}`);
          setClassDetails(response.data);
        } catch (error) {
          console.error('There was an error fetching the class details:', error);
        }
      } else {
        setClassDetails(null); 
      }
    };
    fetchClassDetails();
  }, [selectedClassId]);
  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
  };
  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    if (studentId) {
      try {
        const studentResponse = await axios.get(`http://192.168.0.103:3000/management/students/${studentId}`);
        setStudentDetails(studentResponse.data);
        if (studentResponse.data.classId) {
          const classResponse = await axios.get(`http://192.168.0.103:3000/management/students/class/${studentResponse.data.classId}`);
          setClassDetails(classResponse.data);
        } else {
          setClassDetails(null);
        }
      } catch (error) {
        console.error('There was an error fetching the student details:', error);
      }
    } else {
      setStudentDetails(null);
      setClassDetails(null);
    }
  };
  const handleAddStudent = async () => {
    if (studentIdToAdd && classIdToAdd) {
      try {
        await axios.post('http://192.168.0.103:3000/management/students/add', {
          studentId: studentIdToAdd,
          classId: classIdToAdd,
        });
        alert('Student added successfully');
        setStudentIdToAdd('');
        setClassIdToAdd('');
        handleStudentChange({ target: { value: studentIdToAdd } }); 
        handleClassChange({ target: { value: classIdToAdd } }); 
      } catch (error) {
        console.error('There was an error adding the student:', error);
      }
    } else {
      alert('Please enter both Student ID and Class ID');
    }
  };
  const handleRemoveStudent = async () => {
    if (studentIdToRemove && classIdToRemove) {
      try {
        await axios.delete('http://192.168.0.103:3000/management/students/remove', {
          data: { studentId: studentIdToRemove, classId: classIdToRemove },
        });
        alert('Student removed successfully');
        setStudentIdToRemove('');
        setClassIdToRemove('');
        handleStudentChange({ target: { value: studentIdToRemove } }); 
        handleClassChange({ target: { value: classIdToRemove } }); 
      } catch (error) {
        console.error('There was an error removing the student:', error);
      }
    } else {
      alert('Please enter both Student ID and Class ID');
    }
  };
  return (
    <div>
      <Header />
      <div className="teacher-student-management-page">
        <h1 className="page-title">Teacher Student Management</h1>
        <div className="class-selection-container">
          <label className="class-selection-label">Select Class: </label>
          <select
            className="class-dropdown"
            value={selectedClassId}
            onChange={handleClassChange}
          >
            <option value="">Select a class</option>
            {classNames.map((className) => (
              <option key={className.id} value={className.id}>
                {className.className}
              </option>
            ))}
          </select>
        </div>
        {classDetails && (
          <div className="class-details-card">
            <h3>Class Details</h3>
            <p><strong>Class ID:</strong> {classDetails.id}</p>
            <p><strong>Name:</strong> {classDetails.className}</p>
            <p><strong>Teacher:</strong> {classDetails.teacher?.name}</p>
          </div>
        )}
        {students.length > 0 && (
          <div className="students-list-container">
            <h3 className='class-student'>Students in this Class</h3>
            <ul className="students-list">
              {students.map((student) => (
                <li key={student.id} className="student-item">
                  <p><strong>ID:</strong> {student.id}</p>
                  <p><strong>Name:</strong> {student.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {students.length === 0 && selectedClassId && (
          <p>No students found for this class.</p>
        )}
        <div className="add-student-container">
          <h3>Add New Student to Class</h3>
          <label className="input-label">Student ID: </label>
          <input
            type="number"
            className="student-id-input"
            value={studentIdToAdd}
            onChange={(e) => setStudentIdToAdd(e.target.value)}
          />
          <label className="input-label">Class ID: </label>
          <input
            type="number"
            className="class-id-input"
            value={classIdToAdd}
            onChange={(e) => setClassIdToAdd(e.target.value)}
          />
          <button className="add-student-button" onClick={handleAddStudent}>
            Add Student
          </button>
        </div>
        <div className="remove-student-container">
          <h3>Remove Student from Class</h3>
          <label className="input-label">Student ID: </label>
          <input
            type="number"
            className="student-id-input"
            value={studentIdToRemove}
            onChange={(e) => setStudentIdToRemove(e.target.value)}
          />
          <label className="input-label">Class ID: </label>
          <input
            type="number"
            className="class-id-input"
            value={classIdToRemove}
            onChange={(e) => setClassIdToRemove(e.target.value)}
          />
          <button className="remove-student-button" onClick={handleRemoveStudent}>
            Remove Student
          </button>
        </div>
      </div>
    </div>
  );
};
export default TeacherStudentManagementPage;