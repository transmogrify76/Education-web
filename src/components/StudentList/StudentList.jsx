import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import Header from '../Header/Header';
import './StudentList.css';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); 
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    enrollmentNo: '',
    parentEmail: '',
    dob: '',
    className: '',
    address: '',
    rollNo: '' // Added rollNo to the editFormData state
  });

  const token = localStorage.getItem('authToken');

  // Get class name by classId
  const getClassName = (classId) => {
    const selectedClassItem = classes.find((classItem) => classItem.id === classId);
    return selectedClassItem ? selectedClassItem.className : ''; // Return className if found
  };

  useEffect(() => {
    if (token) {
      fetchClasses();
      fetchStudents(); 
    }
  }, [token]);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://192.168.0.103:3000/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllStudents(response.data);
      setStudents(response.data); // Initially, show all students
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students.');
    }
  };

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://192.168.0.103:3000/class', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes.');
    }
  };

  // Fetch students for a specific class
  const fetchStudentsForClass = async (classId) => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students for class:', error);
      setError('Failed to fetch students for this class.');
    }
  };

  // Handle student deletion
  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://192.168.0.103:3000/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents(); // Refresh the student list after deletion
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student.');
    }
  };

  // Open edit modal with prefilled data
  const openEditModal = (student) => {
    setEditStudent(student);
    setEditFormData({
      name: student.name,
      email: student.email,
      enrollmentNo: student.enrollmentNo,
      dob: student.dob,
      className: student.class.className,
      address: student.address,
      parentEmail: student.parentEmail,
      rollNo: student.rollNo // Populate rollNo when opening the edit modal
    });
  };

  // Handle input change in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle submit for editing student details (PATCH method)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://192.168.0.103:3000/student/update/${editStudent.id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditStudent(null);
      fetchStudents(); // Refresh the student list after update
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student.');
    }
  };

  return (
    <div>
      <Header />
      <h1>Student List</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="select-class">
        <label htmlFor="classSelect">Select Class:</label>
        <select
          id="classSelect"
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            fetchStudentsForClass(e.target.value); // Fetch students for selected class
          }}
        >
          <option value="">--Select a Class--</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.className}
            </option>
          ))}
        </select>
      </div>

      <div className="students-list">
        <h2>Students in Class {selectedClass ? getClassName(selectedClass) : 'All Students'}</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>{selectedClass ? getClassName(selectedClass) : 'Class'}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4">No students found for this class.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.class ? student.class.className : 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="action-button view-button"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="action-button delete-button"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      onClick={() => openEditModal(student)}
                      className="action-button edit-button"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="student-details-modal">
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}></div>
          <div className="modal-content">
            <h2>Student Details</h2>
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Enrollment No:</strong> {selectedStudent.enrollmentNo}</p>
            <p><strong>Parent Email:</strong> {selectedStudent.parentEmail}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Class:</strong> {selectedStudent.class.className}</p>
            <p><strong>DOB:</strong> {selectedStudent.dob}</p>
            <p><strong>Parent Phone No:</strong> {selectedStudent.parent.phoneNo}</p>
            <button onClick={() => setSelectedStudent(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editStudent && (
        <div className="student-edit-modal">
          <div className="modal-overlay" onClick={() => setEditStudent(null)}></div>
          <div className="modal-content">
            <h2>Edit Student Details</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Enrollment No:
                <input
                  type="text"
                  name="enrollmentNo"
                  value={editFormData.enrollmentNo}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Parent Email:
                <input
                  type="email"
                  name="parentEmail"
                  value={editFormData.parentEmail}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                DOB:
                <input
                  type="date"
                  name="dob"
                  value={editFormData.dob}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Class:
                <input
                  type="text"
                  name="className"
                  value={editFormData.className}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Roll Number:
                <input
                  type="text"
                  name="rollNo"
                  value={editFormData.rollNo}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditStudent(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListPage;
