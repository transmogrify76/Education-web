import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import './AdminTeacherFeedback.css';

const AdminTeacherFeedback = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const authToken = localStorage.getItem('authToken');

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://192.168.0.103:3000/class', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [authToken]);

  // When class changes, fetch teachers for that class and reset everything else
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    setTeachers([]);
    setSelectedTeacherId('');
    setFeedbackList([]);
    setSelectedSubject('');

    if (classId) {
      try {
        const response = await fetch(`http://192.168.0.103:3000/teacher/class/${classId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        setTeachers(data.teachers || []);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    }
  };

  // When teacher changes, fetch feedback and reset subject
  const handleTeacherChange = async (e) => {
    const teacherId = e.target.value;
    setSelectedTeacherId(teacherId);
    setFeedbackList([]);
    setSelectedSubject('');

    if (teacherId && selectedClassId) {
      try {
        const url = `http://192.168.0.103:3000/teacher-feedback?teacherId=${teacherId}&studentClassId=${selectedClassId}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        setFeedbackList(data || []);
      } catch (error) {
        console.error('Error fetching teacher feedback:', error);
      }
    }
  };

  // Handle subject select change
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  // Filtered feedback based on selectedSubject
  const filteredFeedback = selectedSubject
    ? feedbackList.filter((fb) => fb.subject.toLowerCase() === selectedSubject.toLowerCase())
    : feedbackList;

  // Extract unique subjects from feedback for dropdown
  const subjects = [...new Set(feedbackList.map((fb) => fb.subject))];

  return (
    <div>
      <Header />
      <div className="feedback-page-container">
        <h1>Teacher Feedback</h1>

        {/* Class selection */}
        <div className="class-dropdown">
          <label htmlFor="class-select">Select Class:</label>
          <select id="class-select" value={selectedClassId} onChange={handleClassChange}>
            <option value="">-- Select a Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className} (ID: {cls.id})
              </option>
            ))}
          </select>
        </div>

        {/* Teacher selection */}
        {teachers.length > 0 && (
          <div className="teacher-dropdown">
            <label htmlFor="teacher-select">Select Teacher:</label>
            <select id="teacher-select" value={selectedTeacherId} onChange={handleTeacherChange}>
              <option value="">-- Select a Teacher --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} (ID: {teacher.id})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject selection */}
        {feedbackList.length > 0 && (
          <div className="subject-dropdown">
            <label htmlFor="subject-select">Filter by Subject:</label>
            <select id="subject-select" value={selectedSubject} onChange={handleSubjectChange}>
              <option value="">-- All Subjects --</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Feedback display */}
        {selectedTeacherId && selectedClassId && (
          <div className="teacher-feedback-details">
            <h3>
              Feedback for Teacher ID {selectedTeacherId} in Class ID {selectedClassId}
              {selectedSubject && ` (Subject: ${selectedSubject})`}
            </h3>

            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <h4>
                    Subject: {feedback.subject}, Date: {feedback.dateCreated}
                  </h4>
                  <ul>
                    {Object.entries(feedback.answers).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No feedback found for this teacher, class, and subject combination.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeacherFeedback;
