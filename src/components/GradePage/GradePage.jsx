import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GradePage.css';
import Header from '../Header/Header';
import { jwtDecode } from 'jwt-decode';

const GradePage = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);  // New state to store subjects assigned to teacher
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(''); // New state for selected subject
  const [assignmentName, setAssignmentName] = useState('');
  const [grade, setGrade] = useState('');
  const [remarks, setRemarks] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authToken = localStorage.getItem('authToken');

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  });

  // Decode token to get teacherId
  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        setTeacherId(decoded?.id);
      } catch (err) {
        console.error('Token decode failed:', err);
      }
    }
  }, [authToken]);

  // Fetch teacher's assigned classes and subjects
  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherClassesAndSubjects = async () => {
      try {
        const response = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`, {
          headers: getAuthHeaders(),
        });

        let teacherClasses = response.data.classes || [];
        let teacherSubjects = response.data.subjects || []; // Assuming subjects are part of the teacher data

        // Sort classes by numeric className (e.g., Class 1, Class 2, ...)
        teacherClasses.sort((a, b) => {
          const aNum = parseInt(a.className.match(/\d+/));
          const bNum = parseInt(b.className.match(/\d+/));
          return aNum - bNum;
        });

        setClasses(teacherClasses);
        setSubjects(teacherSubjects); // Set subjects assigned to the teacher
      } catch (err) {
        console.error('Error fetching teacher classes and subjects:', err);
        setError('Failed to load classes or subjects.');
      }
    };

    fetchTeacherClassesAndSubjects();
  }, [teacherId]);

  // Fetch students for the selected class
  const fetchStudentsForClass = async (classId) => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/class/${classId}`, {
        headers: getAuthHeaders(),
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students for class:', error);
      setError('Failed to fetch students for this class.');
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForClass(selectedClass);
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  // Fetch grades for the selected student
  const fetchGrades = () => {
    if (!selectedStudent) return;

    setLoading(true);
    setError('');
    fetch(`http://192.168.0.103:3000/grading/student/${selectedStudent}`, {
      headers: getAuthHeaders(),
    })
      .then(response => response.json())
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
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedStudent]);

  // Handle submitting a new grade
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedSubject || !assignmentName || !grade || !remarks) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    fetch('http://192.168.0.103:3000/grading', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        studentId: selectedStudent,
        teacherId,
        subject: selectedSubject,  // Use selected subject here
        assignmentName,
        grade,
        remarks,
      }),
    })
      .then(response => response.json())
      .then(() => {
        setLoading(false);
        setError('');
        setSelectedSubject('');
        setAssignmentName('');
        setGrade('');
        setRemarks('');
        fetchGrades(); // Re-fetch the grades for this student
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        setError('Failed to submit grade.');
      });
  };

  // Handle updating the grade
  const handleUpdate = (gradeId, updatedGrade) => {
    setLoading(true);

    // Send updated grade data to the backend
    const gradeUpdateData = {
      grade: updatedGrade.grade,
      remarks: updatedGrade.remarks,
    };

    // Include teacherId in the URL
    fetch(`http://192.168.0.103:3000/grading/student/${selectedStudent}/subject/${updatedGrade.subject}/teacher/${teacherId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(gradeUpdateData),
    })
      .then(response => response.json())
      .then(updatedData => {
        setLoading(false);
        // Update the grades list after the update
        setGrades(prevGrades => 
          prevGrades.map(grade => 
            grade.id === gradeId ? { ...grade, ...updatedData } : grade
          )
        );
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        setError('Failed to update grade.');
      });
  };

  // Render the list of grades for the selected student
  const selectedStudentName = students.find(student => student.id === selectedStudent)?.name;

  return (
    <div>
      <Header />
      <div className="student-grading-page">
        <h1>Create and Update Grade Remarks</h1>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="class">Class</label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
            >
              <option value="">Select a class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

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
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
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
              <h2>Grades for {selectedStudentName}</h2>
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
                          handleUpdate(gradeItem.id, {
                            grade: prompt('New grade:', gradeItem.grade),
                            remarks: prompt('New remarks:', gradeItem.remarks),
                            subject: gradeItem.subject,
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
