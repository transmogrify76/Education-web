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

  // Fetch all classes
  useEffect(() => {
    const fetchClassNames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        setClassNames(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('Error fetching class names');
      } finally {
        setLoading(false);
      }
    };

    fetchClassNames();
  }, []);

  // Fetch teacher's subjects
  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const teacherId = decoded?.id;

        if (teacherId) {
          const response = await axios.get(`http://192.168.0.103:3000/teacher/subjects/${teacherId}`);
          const subjectDetails = Array.isArray(response.data.subjectDetails) ? response.data.subjectDetails : [];
          setTeacherSubjects(subjectDetails);
          setSubjects(subjectDetails);
        }
      } catch (error) {
        console.error('Error fetching teacher subjects:', error);
      }
    };

    fetchTeacherSubjects();
  }, []);

  // Fetch students for selected class
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (selectedClass) {
        setLoading(true);
        setError(null);
        try {
          const studentsResponse = await axios.get(`http://192.168.0.103:3000/class/${selectedClass}`);
          const studentsData = Array.isArray(studentsResponse.data.students) ? studentsResponse.data.students : [];
          setStudents(studentsData);

          const initialMarks = studentsData.reduce((acc, student) => {
            acc[student.id] = teacherSubjects.reduce((subAcc, subject) => {
              subAcc[subject.id] = '';
              return subAcc;
            }, {});
            return acc;
          }, {});
          setMarks(initialMarks);
        } catch (error) {
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
            year: parseInt(year), // 🆕 Include year
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

        {/* Class selection */}
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

        {/* Year selection */}
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

        {/* Student selection */}
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

        {/* Results Table */}
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

        {/* Error and Loading States */}
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default UploadResults;
