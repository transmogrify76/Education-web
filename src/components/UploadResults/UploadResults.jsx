import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './UploadResults.css';
import Header from '../Header/Header';

const UploadResults = () => {
  const [classNames, setClassNames] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch teacher details, classes, and subjects
  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const teacherId = decoded?.id;

        if (teacherId) {
          const response = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`);
          const teacher = response.data;

          const teacherClasses = Array.isArray(teacher.classes) ? teacher.classes : [];
          const teacherSubjects = Array.isArray(teacher.subjects) ? teacher.subjects : [];

          setClassNames(teacherClasses);
          setTeacherSubjects(teacherSubjects);
          setSubjects(teacherSubjects);
        }
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        setError('Error fetching teacher details');
      }
    };

    fetchTeacherDetails();
  }, []);

  // ✅ Fetch students when class changes
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (selectedClass) {
        setLoading(true);
        setError(null);
        try {
          const studentsResponse = await axios.get(`http://192.168.0.103:3000/class/${selectedClass}`);
          const studentsData = Array.isArray(studentsResponse.data.students)
            ? studentsResponse.data.students
            : [];
          setStudents(studentsData);

          // Initialize marks state
          const initialMarks = studentsData.reduce((acc, student) => {
            acc[student.id] = teacherSubjects.reduce((subAcc, subject) => {
              subAcc[subject.id] = '';
              return subAcc;
            }, {});
            return acc;
          }, {});
          setMarks(initialMarks);
        } catch (error) {
          console.error('Error fetching students:', error);
          setError('Error fetching class details (students)');
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
        setMarks({});
      }
    };

    fetchClassDetails();
  }, [selectedClass, teacherSubjects]);

  // ✅ Handle marks entry
  const handleMarksChange = (studentId, subjectId, value) => {
    setMarks(prevMarks => ({
      ...prevMarks,
      [studentId]: {
        ...prevMarks[studentId],
        [subjectId]: value
      }
    }));
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
  };

  // ✅ Submit results
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedClass || Object.keys(marks).length === 0 || !year) {
      alert('Please fill out all fields');
      return;
    }

    let uploadedSubjects = [];

    try {
      for (const studentId in marks) {
        for (const subjectId in marks[studentId]) {
          const resultData = {
            studentId,
            subjectId,
            classId: selectedClass,
            marks: parseFloat(marks[studentId][subjectId]),
            year: parseInt(year)
          };

          if (resultData.marks !== '' && !isNaN(resultData.marks)) {
            await axios.post('http://192.168.0.103:3000/results/create', resultData);
            uploadedSubjects.push(subjectId);
          }
        }
      }

      uploadedSubjects.forEach(subjectId => {
        const subject = subjects.find(sub => sub.id === subjectId);
        if (subject) {
          alert(`Marks for ${subject.name} uploaded successfully!`);
        }
      });

      alert('Results uploaded successfully!');
    } catch (error) {
      console.error('Error uploading results:', error);
      alert('Error uploading results');
    }
  };

  return (
    <div>
      <Header />
      <div className="upload-results-container">
        <h1>Upload Student Results</h1>

        {/* ✅ Class Selection */}
        <div className="form-group">
          <label htmlFor="class">Select Class</label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class</option>
            {classNames.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Year Selection */}
        <div className="form-group">
          <label htmlFor="year">Select Year</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
            min="2000"
            max={new Date().getFullYear()}
            required
          />
        </div>

        {/* ✅ Student Selection */}
        {selectedClass && (
          <div className="form-group">
            <label htmlFor="student">Select Student</label>
            <select
              id="student"
              value={selectedStudent}
              onChange={(e) => handleStudentSelect(e.target.value)}
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ✅ Marks Input Table */}
        {selectedClass && selectedStudent && subjects.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="table-container">
              <table className="upload-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    {subjects.map((subject) => (
                      <th key={subject.id}>{subject.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      {subjects.map((subject) => (
                        <td key={subject.id}>
                          <input
                            type="number"
                            value={marks[student.id]?.[subject.id] || ''}
                            onChange={(e) =>
                              handleMarksChange(student.id, subject.id, e.target.value)
                            }
                            placeholder="Enter marks"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="submit">Upload Results</button>
          </form>
        )}

        {/* ✅ Loading and Error Messages */}
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default UploadResults;
