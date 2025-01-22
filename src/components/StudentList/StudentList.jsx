import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa'; // Importing icons
import Header from '../Header/Header'
;
const StudentListPage = () => {
  const [students, setStudents] = useState([]); // State to store students data
  const [classes, setClasses] = useState([]); // State to store classes data
  const [selectedClass, setSelectedClass] = useState(''); // State for selected class
  const [error, setError] = useState(''); // Error message state

  // Retrieve token from localStorage
  const token = localStorage.getItem('authToken'); // Get the token from localStorage

  useEffect(() => {
    if (token) {
      fetchClasses(); // Fetch classes when token exists
      fetchStudents(); // Also fetch all students
    }
  }, [token]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForClass(selectedClass); // Fetch students for selected class
    } else {
      fetchStudents(); // If no class is selected, fetch all students
    }
  }, [selectedClass]);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/student', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data); // Set students data in state
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students.');
    }
  };

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/class', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(response.data); // Set classes data in state
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes.');
    }
  };

  // Fetch students for the selected class
  const fetchStudentsForClass = async (classId) => {
    try {
      const response = await axios.get(`http://localhost:3000/class/${classId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data); // Set students data for selected class
    } catch (error) {
      console.error('Error fetching students for class:', error);
      setError('Failed to fetch students for this class.');
    }
  };

  // Handle Edit button click
  const handleEdit = (studentId) => {
    console.log('Edit student', studentId);
  };

  // Handle Delete button click
  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:3000/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStudents(); // Refresh the student list after deletion
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student.');
    }
  };

  return (
    <div>
          <Header/>
      <h1>Student List</h1>

      {/* Display Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Dropdown to select class */}
      <div className="select-class">
        <label htmlFor="classSelect">Select Class:</label>
        <select
          id="classSelect"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">--Select a Class--</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.className}
            </option>
          ))}
        </select>
      </div>

      {/* Table to display students for the selected class or all students */}
      <div className="students-list">
        <h2>{selectedClass ? 'Students in Selected Class' : 'All Students'}</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="3">No students found.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <button onClick={() => handleEdit(student.id)} className="action-button edit-button">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="action-button delete-button">
                      <FaTrashAlt />
                    </button>
                    <button onClick={() => console.log('View', student.id)} className="action-button view-button">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentListPage;
