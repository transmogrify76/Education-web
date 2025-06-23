import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './TeacherFeedbackPage.css';
import Header from "../Header/Header"

const TeacherFeedbackPage = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);

  // Decode token and fetch teacher data
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError("Auth token not found.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const id = decoded.id;
      const subjectDetails = decoded.subjectDetails || [];

      if (!id) {
        setError("Teacher ID not found in token.");
        return;
      }

      setTeacherId(id);
      setSubjects(subjectDetails);

      fetch(`http://192.168.0.103:3000/teacher/${id}`)
        .then(res => res.json())
        .then(data => setClasses(data.classes || []))
        .catch(() => setError("Failed to fetch teacher's classes."));
    } catch (err) {
      setError("Invalid auth token.");
    }
  }, []);

  // Fetch class subjects when class is selected
  useEffect(() => {
    if (!selectedClassId) return;

    fetch(`http://192.168.0.103:3000/subjects/class/${selectedClassId}`)
      .then(res => res.json())
      .then(data => setClassSubjects(data || []))
      .catch(() => setError("Failed to fetch subjects for selected class."));
  }, [selectedClassId]);

  // Fetch feedback when all 3 params are selected
  useEffect(() => {
    if (!teacherId || !selectedClassId || !selectedSubjectId) return;

    const url = `http://192.168.0.103:3000/teacher-feedback?teacherId=${teacherId}&studentClassId=${selectedClassId}&subjectId=${selectedSubjectId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setFeedbackList(data || []))
      .catch(() => setError("Failed to fetch feedback."));
  }, [teacherId, selectedClassId, selectedSubjectId]);

  // Filter subjects assigned to both teacher and selected class
  const filteredSubjects = subjects.filter(teacherSubject =>
    classSubjects.some(classSubj => classSubj.id === teacherSubject.id)
  );

  return (
    <div>
      <Header/>
      <div className="container">
      <h2>Teacher Feedback Page</h2>

      {error && <p className="error">{error}</p>}

      {!error && teacherId && (
        <>
          <div className="section">
            <p><strong>Teacher ID:</strong> {teacherId}</p>
          </div>

          <div className="section">
            <h3>Select Class</h3>
            <select
              value={selectedClassId}
              onChange={e => {
                setSelectedClassId(e.target.value);
                setSelectedSubjectId(''); // Reset subject on class change
                setFeedbackList([]);      // Reset feedback on class change
              }}
              className="dropdown"
            >
              <option value="">-- Select a Class --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  Class {cls.className} (ID: {cls.id})
                </option>
              ))}
            </select>
          </div>

          <div className="section">
            <h3>Select Subject</h3>
            <select
              value={selectedSubjectId}
              onChange={e => {
                setSelectedSubjectId(e.target.value);
                setFeedbackList([]); // Reset feedback on subject change
              }}
              className="dropdown"
              disabled={!selectedClassId}
            >
              <option value="">-- Select a Subject --</option>
              {filteredSubjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} (ID: {subject.id})
                </option>
              ))}
            </select>
          </div>

          <div className="section">
            <h3>Feedback</h3>
            {selectedClassId && selectedSubjectId && feedbackList.length === 0 && (
              <p>No feedback available for this class and subject.</p>
            )}

            {feedbackList.map((fb, index) => (
              <div className="feedback-card" key={index}>
                <p><strong>Class:</strong> {fb.class}</p>
                <p><strong>Subject:</strong> {fb.subject}</p>
                <p><strong>Date:</strong> {fb.dateCreated}</p>
                <h4>Feedback Responses:</h4>
                <ul>
                  {Object.entries(fb.answers)
                    .filter(([key]) => key.startsWith('Q'))
                    .map(([qKey, question]) => {
                      const ansKey = qKey.replace('Q', 'Ans');
                      const answer = fb.answers[ansKey] || 'No Answer';
                      return (
                        <li key={qKey}>
                          <strong>{question}</strong><br />
                          <span className="answer">{answer}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default TeacherFeedbackPage;
