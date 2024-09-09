import React, { useState, useEffect } from 'react';
import './GradePage.css';

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

  useEffect(() => {
    fetch('http://localhost:3000/student')
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
      fetch(`http://localhost:3000/grading/student/${selectedStudent}`)
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          if (Array.isArray(data)) {
            setGrades(data);
          } else {
            console.error('Expected an array of grades');
          }
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching grades:', error);
        });
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: selectedStudent,
        subject,
        assignmentName,
        grade,
        remarks,
      }),
    })
      .then(response => response.json())
      .then(data => {
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
    fetch(`http://localhost:3000/grading/student/${selectedStudent}`)
      .then(response => response.json())
      .then(data => setGrades(data))
      .catch(error => console.error('Error fetching grades:', error));
  };

  const handleUpdate = (gradeId, updatedGrade) => {
    setLoading(true);
    fetch(`http://localhost:3000/grading/student/${selectedStudent}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGrade),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        fetchGrades();
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  return (
    <div className="grade-page">
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
        {/* Rest of the form fields */}
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        selectedStudent && (
          <div>
            <h2>Grades for Student ID: {selectedStudent}</h2>
            <ul>
              {grades.map(gradeItem => (
                <li key={gradeItem.id}>
                  <strong>Subject:</strong> {gradeItem.subject}, 
                  <strong> Assignment:</strong> {gradeItem.assignmentName}, 
                  <strong> Grade:</strong> {gradeItem.grade}, 
                  <strong> Remarks:</strong> {gradeItem.remarks}
                  <button
                    onClick={() =>
                      handleUpdate(gradeItem.id, {
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
          </div>
        )
      )}
    </div>
  );
};

export default GradePage;
