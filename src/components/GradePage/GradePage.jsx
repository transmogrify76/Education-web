import React, { useState, useEffect } from 'react';
import './GradePage.css';
import Header from '../Header/Header';

const GradePage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [grade, setGrade] = useState('');
  const [remarks, setRemarks] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Retrieve the token from localStorage
  const authToken = localStorage.getItem('authToken');

  // Helper function to get headers with the Bearer token
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,  // Add the token in the Authorization header
    };
  };

  useEffect(() => {
    fetch('http://localhost:3000/student', {
      headers: getAuthHeaders(),  // Include the token in the request header
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error('Expected an array of students');
        }
      })
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      setLoading(true);
      setError('');
      fetch(`http://localhost:3000/grading/student/${selectedStudent}`, {
        headers: getAuthHeaders(),  // Include the token in the request header
      })
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
        });
    } else {
      setGrades([]);
    }
  }, [selectedStudent]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!subject || !assignmentName || !grade || !remarks) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    fetch('http://localhost:3000/grading', {
      method: 'POST',
      headers: getAuthHeaders(),  // Include the token in the request header
      body: JSON.stringify({
        studentId: selectedStudent,
        subject,
        assignmentName,
        grade,
        remarks,
      }),
    })
      .then(response => response.json())
      .then(() => {
        setLoading(false);
        setError('');
        setSubject('');
        setAssignmentName('');
        setGrade('');
        setRemarks('');
        fetchGrades();
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        setError('Failed to submit grade.');
      });
  };

  const fetchGrades = () => {
    fetch(`http://localhost:3000/grading/student/${selectedStudent}`, {
      headers: getAuthHeaders(),  // Include the token in the request header
    })
      .then(response => response.json())
      .then(data => setGrades(data))
      .catch(error => console.error('Error fetching grades:', error));
  };

  const handleUpdate = (gradeId, subject, updatedGrade) => {
    setLoading(true);
    fetch(`http://localhost:3000/grading/student/${selectedStudent}/subject/${subject}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),  // Include the token in the request header
      body: JSON.stringify(updatedGrade),
    })
      .then(() => {
        setLoading(false);
        fetchGrades();
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  // Find the name of the selected student based on the selectedStudent ID
  const selectedStudentName = students.find(student => student.id === selectedStudent)?.name;

  return (
    <div>
      <Header />
      <div className="student-grading-page">
        <h1>Create and Update Grade Remarks</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="student">Student</label>
            <select
              id="student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (ID: {student.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignment">Assignment Name</label>
            <input
              type="text"
              id="assignment"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grade</label>
            <input
              type="text"
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks</label>
            <input
              type="text"
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          selectedStudent && (
            <div>
              {/* Display student's name fetched from the grades data */}
              <h2>Grades : {grades.length > 0 ? grades[0].student.name : selectedStudentName}</h2> 
              {grades.length === 0 && !error ? (
                <p>No grades available for this student.</p>
              ) : (
                <ul>
                  {grades.map(gradeItem => (
                    <li key={gradeItem.id}>
                      <strong>Subject:</strong> {gradeItem.subject}, 
                      <strong> Assignment:</strong> {gradeItem.assignmentName}, 
                      <strong> Grade:</strong> {gradeItem.grade}, 
                      <strong> Remarks:</strong> {gradeItem.remarks}
                      <button
                        onClick={() =>
                          handleUpdate(gradeItem.id, gradeItem.subject, {
                            grade: prompt('New grade:', gradeItem.grade),
                            remarks: prompt('New remarks:', gradeItem.remarks),
                          })
                        }
                      >
                        Update
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GradePage;
