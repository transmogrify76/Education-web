import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './UploadResults.css';
import Header from '../Header/Header';

const UploadResults = () => {
  const [teacherId, setTeacherId] = useState(null);
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
  const [uploadHistory, setUploadHistory] = useState([]);

  // Decode JWT and set teacherId
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.id) {
          setTeacherId(decoded.id);
        } else {
          throw new Error('Teacher ID not found in token');
        }
      } catch (err) {
        console.error('Invalid token:', err);
        setError('Authentication error. Please log in again.');
      }
    } else {
      setError('Authentication token not found. Please log in.');
    }
  }, []);

  // Fetch teacher details
  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`);
        const teacher = response.data;

        const teacherClasses = Array.isArray(teacher.classes) ? teacher.classes : [];
        const teacherSubjects = Array.isArray(teacher.subjects) ? teacher.subjects : [];

        setClassNames(teacherClasses);
        setTeacherSubjects(teacherSubjects);
        setSubjects(teacherSubjects);

        if (teacherClasses.length > 0) {
          const firstClassId = teacherClasses[0].id;
          setSelectedClass(firstClassId.toString());
        }
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        setError('Error fetching teacher details');
      }
    };

    fetchTeacherDetails();
  }, [teacherId]);

  // Fetch students and history when class or year changes
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!selectedClass || !teacherId) return;

      setLoading(true);
      try {
        const classIdNum = Number(selectedClass);
        const response = await axios.get(`http://192.168.0.103:3000/class/${classIdNum}`);
        const studentsData = response.data.students || [];
        setStudents(studentsData);

        const initialMarks = studentsData.reduce((acc, student) => {
          acc[student.id] = teacherSubjects.reduce((subAcc, subject) => {
            subAcc[subject.id] = '';
            return subAcc;
          }, {});
          return acc;
        }, {});
        setMarks(initialMarks);

        fetchUploadHistory(classIdNum, teacherId, year);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching class details (students)');
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [selectedClass, teacherSubjects, teacherId, year]);

  // Fetch upload history (new API)
  const fetchUploadHistory = async (classId, teacherIdParam, selectedYear) => {
    if (!classId || !teacherIdParam || !selectedYear) return;

    try {
      const response = await axios.get('http://192.168.0.103:3000/results/by-teacher-class-year', {
        params: {
          teacherId: teacherIdParam,
          classId: Number(classId),
          year: Number(selectedYear),
        },
      });
      setUploadHistory(response.data || []);
    } catch (error) {
      console.error('', error);
      setError('');
    }
  };

  const handleMarksChange = (studentId, subjectId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subjectId]: value }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedClass) {
      alert('Please select a class before uploading results.');
      return;
    }

    try {
      const classIdNum = Number(selectedClass);

      for (const studentId in marks) {
        for (const subjectId in marks[studentId]) {
          const mark = parseFloat(marks[studentId][subjectId]);
          if (!isNaN(mark)) {
            await axios.post('http://192.168.0.103:3000/results/create', {
              studentId: Number(studentId),
              subjectId: Number(subjectId),
              classId: classIdNum,
              marks: mark,
              year: parseInt(year, 10)
            });
          }
        }
      }

      alert('Results uploaded successfully!');
      fetchUploadHistory(classIdNum, teacherId, year);
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

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Select Class</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="">Select class</option>
            {classNames.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Select Student</label>
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
          >
            <option value="">Select student</option>
            {students.map(st => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <form onSubmit={handleSubmit}>
            <table className="upload-table">
              <thead>
                <tr>
                  <th>Student</th>
                  {subjects.map(sub => (
                    <th key={sub.id}>{sub.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{students.find(st => st.id === Number(selectedStudent))?.name}</td>
                  {subjects.map(sub => (
                    <td key={sub.id}>
                      <input
                        type="number"
                        value={marks[selectedStudent]?.[sub.id] || ''}
                        onChange={e =>
                          handleMarksChange(selectedStudent, sub.id, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <button type="submit">Upload</button>
          </form>
        )}

        <h2>Upload History</h2>
        {uploadHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.map(res => (
                <tr key={res.id}>
                  <td>{res.student?.name}</td>
                  <td>{res.subject?.name}</td>
                  <td>{res.marks}</td>
                  <td>{res.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No history</p>
        )}

        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default UploadResults;
