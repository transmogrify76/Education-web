import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminClassManagementPage.css';

const AdminClassManagementPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [classes, setClasses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacherId) {
      fetchClassesByTeacher(selectedTeacherId);
    } else {
      setClasses([]); // Clear classes if no teacher is selected
    }
  }, [selectedTeacherId]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/teacher');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to fetch teachers.');
    }
  };

  const fetchClassesByTeacher = async (teacherId) => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      const response = await axios.get(`http://localhost:3000/class/teacher/${teacherId}`);
      if (response.data && Array.isArray(response.data)) {
        setClasses(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected response format.');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherChange = (e) => {
    setSelectedTeacherId(e.target.value);
    setError(''); // Clear error on teacher change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { className, subject, teacherId: Number(selectedTeacherId) };

    try {
      if (editMode) {
        await axios.patch(`http://localhost:3000/class/${editClassId}`, payload);
        setEditMode(false);
        setEditClassId(null);
      } else {
        await axios.post('http://localhost:3000/class', payload);
      }
      setClassName('');
      setSubject('');
      fetchClassesByTeacher(selectedTeacherId);
    } catch (error) {
      console.error('Error submitting class:', error);
      setError('Failed to submit class.');
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
      await axios.delete(`http://localhost:3000/class/${classId}`);
      fetchClassesByTeacher(selectedTeacherId);
    } catch (error) {
      console.error('Error deleting class:', error);
      setError('Failed to delete class.');
    }
  };

  return (
    <div className="admin-class-management-page">
      <h1>Admin Class Management</h1>

      <div className="teacher-select">
        <label htmlFor="teacher">Select Teacher:</label>
        <select id="teacher" value={selectedTeacherId} onChange={handleTeacherChange}>
          <option value="">-- Select Teacher --</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeacherId && (
        <>
          {loading ? (
            <p>Loading classes...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
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
                <h2>Classes for {teachers.find(t => t.id === Number(selectedTeacherId))?.name}</h2>
                <ul>
                  {classes.length > 0 ? (
                    classes.map((classItem) => (
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
                    ))
                  ) : (
                    <p>No classes available for this teacher.</p>
                  )}
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminClassManagementPage;
