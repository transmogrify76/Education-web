import React, { useState, useEffect } from 'react';
import './TeacherList.css';
import Header from '../Header/Header';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  // Fetching teachers data from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:3000/teacher');
        const data = await response.json();
        setTeachers(data);  // Populate teachers list
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  // Fetching class data from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/class');
        const data = await response.json();
        setClasses(data);  // Populate class list
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  // Handle class selection and filter teachers based on the selected class
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);

    if (classId) {
      const selectedClass = classes.find(c => c.id === parseInt(classId));
      if (selectedClass) {
        setFilteredTeachers(selectedClass.teachers);
      }
    } else {
      setFilteredTeachers([]); // Show no teachers if no class is selected
    }
  };

  // Handle Delete Teacher action
  const handleDeleteTeacher = async (teacherId) => {
    // Simulate a DELETE API request (you need to integrate this with your API)
    try {
      await fetch(`http://localhost:3000/teacher/${teacherId}`, {
        method: 'DELETE',
      });
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId)); // Update the UI
      alert('Teacher deleted successfully');
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  // Handle Edit Teacher action
  const handleEditTeacher = (teacherId) => {
    // Implement your edit logic here (e.g., open a modal with the teacher's info to update)
    alert(`Edit teacher with ID: ${teacherId}`);
  };

  return (
    <div>
      <Header />
    <div className="teacher-list-container">
      <h1>Teacher List</h1>

      {/* Class Selection Dropdown */}
      <div className="class-dropdown">
        <label htmlFor="classId">Select Class:</label>
        <select
          id="classId"
          value={selectedClassId}
          onChange={handleClassChange}
        >
          <option value="">Select a Class</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.className}
            </option>
          ))}
        </select>
      </div>

      {/* All Teachers Table */}
      <div className="teacher-table-container">
        <h2>All Teachers</h2>
        <table className="teacher-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Address</th>
              <th>Actions</th> {/* Column for actions */}
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phoneNo}</td>
                  <td>{teacher.address}</td>
                  <td>
                    <button onClick={() => handleEditTeacher(teacher.id)}>Edit</button>
                    <button onClick={() => handleDeleteTeacher(teacher.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No teachers available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Classwise Teachers Table */}
      <div className="teacher-table-container">
        <h2>Classwise Teacher List</h2>
        {selectedClassId && (
          <table className="teacher-table">
            <thead>
              <tr>
                <th>Professor Name</th>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Class Name</th>
                <th>Actions</th> {/* Column for actions */}
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) =>
                  teacher.timetables.map((timetable) => (
                    <tr key={timetable.id}>
                      <td>{timetable.professor}</td>
                      <td>{timetable.day}</td>
                      <td>{timetable.time}</td>
                      <td>{timetable.subject}</td>
                      <td>{timetable.class.className}</td>
                      <td>
                        <button onClick={() => handleEditTeacher(teacher.id)}>Edit</button>
                        <button onClick={() => handleDeleteTeacher(teacher.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="6">No teachers available for the selected class.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
};

export default TeacherList;
