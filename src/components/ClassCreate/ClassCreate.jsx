import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ClassCreate.css';
import Header from '../Header/Header';

const ClassCreate = () => {
  const { teacherId } = useParams(); // Get teacherId from URL params
  const [className, setClassName] = useState('');
  const [teachers, setTeachers] = useState([]); // Store list of teachers
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]); // Store selected teacher IDs
  const [classes, setClasses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [error, setError] = useState(''); // For error messages

  // Retrieve token from localStorage
  const token = localStorage.getItem('authToken'); // 'authToken' is the key for the admin token

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [teacherId]); // Fetch classes and teachers whenever teacherId changes

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://192.168.0.103:3000/teacher', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeachers(response.data); // Store teachers data in the state
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to fetch teachers.');
    }
  };

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://192.168.0.103:3000/class', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes.');
    }
  };

  // Fetch class by ID
  const fetchClassById = async (classId) => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/class/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { className, teacherIds } = response.data; // Retrieve className and teacherIds
      setClassName(className);
      setSelectedTeacherIds(teacherIds || []); // Set selected teacher IDs
      setEditClassId(classId);
      setEditMode(true);
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      setError('Failed to fetch class details.');
    }
  };

  // Handle form submit (Create or Update class)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { className, teacherIds: selectedTeacherIds }; // Include teacherIds in the payload

    try {
      if (editMode) {
        // Update existing class (PATCH method)
        await axios.patch(`http://192.168.0.103:3000/class/${editClassId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditMode(false);
        setEditClassId(null);
      } else {
        // Create new class (POST method)
        await axios.post('http://192.168.0.103:3000/class', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setClassName('');
      setSelectedTeacherIds([]);
      fetchClasses();
    } catch (error) {
      console.error('Error submitting class:', error);
      setError('Failed to submit class.');
    }
  };

  // Handle Edit button click
  const handleEdit = (classItem) => {
    fetchClassById(classItem.id); // Fetch and set class details
  };

  // Handle Delete button click
  const handleDelete = async (classId) => {
    try {
      await axios.delete(`http://192.168.0.103:3000/class/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      setError('Failed to delete class.');
    }
  };

  // Handle checkbox change for teachers
  const handleTeacherChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTeacherIds((prev) => {
      if (checked) {
        return [...prev, parseInt(value)]; // Add teacherId to the array
      } else {
        return prev.filter((id) => id !== parseInt(value)); // Remove teacherId from the array
      }
    });
  };

  // Handle Create New Class button click
  const handleCreateNewClass = () => {
    setClassName('');
    setSelectedTeacherIds([]);
    setEditMode(false);
    setEditClassId(null);
  };

  // Handle Cancel button click (when in Edit Mode)
  const handleCancelEdit = () => {
    setEditMode(false);
    setClassName('');
    setSelectedTeacherIds([]);
    setEditClassId(null);
  };

  return (
    <div>
      <Header />
      <div className="class-management-page">
        <h1>Class Management</h1>

        {/* Display Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Form for creating/updating class */}
        <form className="class-form" onSubmit={handleSubmit}>
          <label htmlFor="className">Class Name:</label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />

          <label>Assign Teachers:</label>
          <div className="teachers-list">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="teacher-checkbox">
                <input
                  type="checkbox"
                  id={`teacher-${teacher.id}`}
                  value={teacher.id}
                  checked={selectedTeacherIds.includes(teacher.id)}
                  onChange={handleTeacherChange}
                />
                <label htmlFor={`teacher-${teacher.id}`}>{teacher.name}</label>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button">
            {editMode ? 'Update Class' : 'Create Class'}
          </button>

          {/* Cancel or Create New Class buttons */}
          {editMode && (
            <>
              <button type="button" onClick={handleCancelEdit} className="cancel-button">
                Cancel Edit
              </button>
              <button type="button" onClick={handleCreateNewClass} className="create-new-button">
                Create New Class
              </button>
            </>
          )}
        </form>

        {/* Table to display existing classes */}
        <div className="classes-list">
          <h2>All Classes</h2>
          <table className="classes-table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Teachers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.id}>
                  <td>{classItem.className}</td>
                  <td>{classItem.teachers?.map((teacher) => teacher.name).join(', ')}</td>
                  <td>
                    <button onClick={() => handleEdit(classItem)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(classItem.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassCreate;
