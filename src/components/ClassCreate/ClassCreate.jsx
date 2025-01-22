import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ClassCreate.css';
import Header from '../Header/Header';

const ClassCreate = () => {
  const { teacherId } = useParams(); // Get teacherId from URL params
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [error, setError] = useState(''); // For error messages

  // Retrieve token from localStorage
  const token = localStorage.getItem('authToken'); // 'authToken' is the key for the admin token

  useEffect(() => {
    fetchClasses();
  }, [teacherId]); // Fetch classes whenever teacherId changes

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/class', {
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
      const response = await axios.get(`http://localhost:3000/class/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { className } = response.data; // Only retrieve className
      setClassName(className);
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
    const payload = { className, teacherId: Number(teacherId) }; // Only include className in the payload

    try {
      if (editMode) {
        // Update existing class (PATCH method)
        await axios.patch(`http://localhost:3000/class/${editClassId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditMode(false);
        setEditClassId(null);
      } else {
        // Create new class (POST method)
        await axios.post('http://localhost:3000/class', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setClassName('');
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
      await axios.delete(`http://localhost:3000/class/${classId}`, {
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

          <button type="submit" className="submit-button">
            {editMode ? 'Update Class' : 'Create Class'}
          </button>
        </form>

        {/* Table to display existing classes */}
        <div className="classes-list">
          <h2>All Classes</h2>
          <table className="classes-table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.id}>
                  <td>{classItem.className}</td>
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
