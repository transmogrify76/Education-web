import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceAdmin.css';
import Header from '../Header/Header';

const AttendanceAdmin = () => {
  const [classNames, setClassNames] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all classes
  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        if (Array.isArray(response.data)) {
          setClassNames(response.data);
        } else {
          setError('Invalid class data received.');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('Failed to fetch classes.');
      }
    };

    fetchAllClasses();
  }, []);

  // Fetch students for selected class
  const fetchStudentsForClass = async (classId) => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/class/${classId}`);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students for class:', error);
      setError('Failed to fetch students for this class.');
    }
  };

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);
    setSelectedStudent('');
    setAttendanceHistory([]);
    fetchStudentsForClass(selectedClassId);
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    setAttendanceHistory([]);

    if (studentId) {
      try {
        const response = await axios.get(`http://192.168.0.103:3000/attendance?studentId=${studentId}`);
        const data = response.data.filter((record) => record.date !== null);
        setAttendanceHistory(data);
      } catch (error) {
        console.error('Error fetching attendance history:', error);
        setError('');
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="attendance-page">
        <h1 className="page-title">Attendance Viewer</h1>
        {error && <p className="error">{error}</p>}

        <div className="child-selection">
          <div className="select-class">
            <label htmlFor="classSelect">Select Class:</label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={handleClassChange}
              required
            >
              <option value="">--Select a Class--</option>
              {classNames.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div className="select-student">
              <label htmlFor="studentSelect">Select Student:</label>
              <select
                id="studentSelect"
                value={selectedStudent}
                onChange={handleStudentChange}
                required
              >
                <option value="">--Select a Student--</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Attendance History Section */}
        {selectedStudent && (
          <div className="attendance-history">
            <h2>
              Attendance History for{' '}
              {students.find((s) => s.id.toString() === selectedStudent)?.name}
            </h2>

            {attendanceHistory.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td className={record.present ? 'present' : 'absent'}>
                        {record.present ? 'Present' : 'Absent'}
                      </td>
                      <td>{record.classEntity?.className || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-attendance">This student does not have any attendance records.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceAdmin;
