import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './TeacherProfile.css';
import Header from '../Header/Header'; // ✅ Make sure Header component exists in this path

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const teacherId = decoded.id;

      axios
        .get(`http://192.168.0.103:3000/teacher/${teacherId}`)
        .then((response) => setTeacher(response.data))
        .catch(() => setError('Failed to fetch teacher data.'));
    } catch (err) {
      console.error('Token decode error:', err);
      setError('Invalid token.');
    }
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!teacher) return <div className="teacher-profile">Loading...</div>;

  return (
    <div>
      <Header />
      <div className="teacher-profile">
        <h1>Teacher Profile</h1>

        <div className="profile-section detail-row">
          <div className="detail-col">
            <p><strong>Name:</strong> {teacher.name}</p>
            <p><strong>Email:</strong> {teacher.email}</p>
          </div>
          <div className="detail-col">
            <p><strong>Phone Number:</strong> {teacher.phoneNo}</p>
            <p><strong>Gender:</strong> {teacher.gender}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Address</h2>
          <p>{teacher.address}</p>
        </div>

        <div className="profile-section">
          <h2>Subjects</h2>
          {teacher.subjects?.length > 0 ? (
            <ul>
              {teacher.subjects.map((subject) => (
                <li key={subject.id}>{subject.name}</li>
              ))}
            </ul>
          ) : (
            <p>No subjects assigned.</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Classes</h2>
          {teacher.classes?.length > 0 ? (
            <ul>
              {teacher.classes.map((cls) => (
                <li key={cls.id}>Class {cls.className}</li>
              ))}
            </ul>
          ) : (
            <p>No classes assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
