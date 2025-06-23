import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './TeacherProfile.css';
import Header from '../Header/Header';

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);
  const [classSubjectMap, setClassSubjectMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const teacherId = decoded.id;
      const teacherSubjects = decoded.subjectDetails || [];

      axios
        .get(`http://192.168.0.103:3000/teacher/${teacherId}`)
        .then(async (response) => {
          const teacherData = response.data;

          // Fetch subjects for each class
          const classPromises = teacherData.classes.map(cls =>
            axios
              .get(`http://192.168.0.103:3000/subjects/class/${cls.id}`)
              .then(res => ({
                classId: cls.id,
                subjects: res.data.filter(classSubject =>
                  teacherSubjects.some(ts => ts.id === classSubject.id)
                )
              }))
              .catch(() => ({
                classId: cls.id,
                subjects: []
              }))
          );

          const classSubjectsResults = await Promise.all(classPromises);
          const subjectMap = {};
          classSubjectsResults.forEach(({ classId, subjects }) => {
            subjectMap[classId] = subjects;
          });

          setTeacher({ ...teacherData, subjects: teacherSubjects });
          setClassSubjectMap(subjectMap);
        })
        .catch(() => setError('Failed to fetch teacher data.'));
    } catch (err) {
      console.error('Token decode error:', err);
      setError('Invalid token.');
    }
  }, []);

  if (error) return <div className="error-box">{error}</div>;
  if (!teacher) return <div className="teacher-profile">Loading...</div>;

  return (
    <div>
      <Header />
      <div className="teacher-profile">
        <div className="profile-header no-photo">
          <div className="profile-meta">
            <h1>{teacher.name}</h1>
            <p>{teacher.email}</p>
            <span className="profile-role">Teacher</span>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <h2>Contact Information</h2>
            <p><strong>Phone:</strong> {teacher.phoneNo}</p>
            <p><strong>Gender:</strong> {teacher.gender}</p>
            <p><strong>Address:</strong> {teacher.address}</p>
          </div>

          <div className="profile-card">
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

          <div className="profile-card">
            <h2>Classes & Subjects</h2>
            {teacher.classes?.length > 0 ? (
              <ul>
                {teacher.classes.map((cls) => (
                  <li key={cls.id}>
                    <strong>Class {cls.className}</strong>
                    {classSubjectMap[cls.id] && classSubjectMap[cls.id].length > 0 ? (
                      <ul className="nested-subjects">
                        {classSubjectMap[cls.id].map(subj => (
                          <li key={subj.id}>{subj.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ marginLeft: '1em', fontStyle: 'italic' }}>No subjects assigned to this class</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No classes assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
