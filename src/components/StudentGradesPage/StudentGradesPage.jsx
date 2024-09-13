import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StudentGradesPage.css';
import Header from '../Header/Header'

const StudentGradesPage = () => {
  const { studentId } = useParams();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      setError('');
      fetch(`http://localhost:3000/grading/student/${studentId}`)
        .then(response => {
          if (response.status === 404) {
            setGrades([]);
            setError('No grades available for this student.');
            return [];
          }
          return response.json();
        })
        .then(data => {
          setLoading(false);
          if (Array.isArray(data)) {
            setGrades(data);
          }
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching grades:', error);
          setError('Failed to fetch grades.');
        });
    }
  }, [studentId]);

  return (
    <div>
    <Header/>
    <div className="student-grades-page">
      <h1>Grades for Student ID: {studentId}</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grades-container">
          {grades.length === 0 ? (
            <p>No grades available for this student.</p>
          ) : (
            grades.map(gradeItem => (
              <div key={gradeItem.id} className="grade-box">
                <strong>Subject:</strong> <p>{gradeItem.subject}</p>
                <strong>Assignment:</strong> <p>{gradeItem.assignmentName}</p>
                <strong>Grade:</strong> <p>{gradeItem.grade}</p>
                <strong>Remarks:</strong> <p>{gradeItem.remarks}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default StudentGradesPage;
