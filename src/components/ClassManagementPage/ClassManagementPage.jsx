import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ClassManagementPage.css';
import Header from '../Header/Header';

const ClassManagementPage = () => {
  const { teacherId } = useParams(); // Get teacherId from URL params
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [classes, setClasses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editClassId, setEditClassId] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, [teacherId]); // Fetch classes whenever teacherId changes

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/class/teacher/${teacherId}`);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { className, subject, teacherId: Number(teacherId) };

    try {
      if (editMode) {
        // Update existing class (PATCH method)
        await axios.patch(`http://192.168.0.103:3000/class/${editClassId}`, payload);
        setEditMode(false);
        setEditClassId(null);
      } else {
        // Create new class (POST method)
        await axios.post('http://192.168.0.103:3000/class', payload);
      }
      setClassName('');
      setSubject('');
      fetchClasses();
    } catch (error) {
      console.error('Error submitting class:', error);
    }
  };

  const handleEdit = (classItem) => {
    setClassName(classItem.className);
    setSubject(classItem.subject);
    setEditMode(true);
    setEditClassId(classItem.id);
  };

  const handleDelete = async (classId) => {
    try {
      await axios.delete(`http://192.168.0.103:3000/class/${classId}`);
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <div>
      <Header/>
    <div className="class-management-page">
      <h1>Class Management</h1>

      <form className="class-form" onSubmit={handleSubmit}>
        <label htmlFor="className">Class Name:</label>
        <input
          type="text"
          id="className"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />

        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          {editMode ? 'Update Class' : 'Create Class'}
        </button>
      </form>

      <div className="classes-list">
        <h2>Existing Classes</h2>
        <ul>
          {classes.map((classItem) => (
            <li key={classItem.id}>
              <span>{classItem.className} - {classItem.subject}</span>
              <div className="action-buttons">
                <button onClick={() => handleEdit(classItem)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(classItem.id)} className="delete-button">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default ClassManagementPage;
