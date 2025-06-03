import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Attendance.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parentId, setParentId] = useState(null);
  const navigate = useNavigate();

  // Decode JWT and fetch student's data
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        const parentIdFromToken = decodedToken.id;
        setParentId(parentIdFromToken);

        const fetchStudentData = async () => {
          try {
            const response = await fetch(`http://192.168.0.103:3000/parent/${parentIdFromToken}`);
            if (!response.ok) {
              throw new Error('Failed to fetch student data');
            }
            const data = await response.json();
            setStudents(data.students || []);
          } catch (error) {
            console.error(error);
            setError('Error fetching student data');
          } finally {
            setLoading(false);
          }
        };

        fetchStudentData();
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setError('Invalid token. Please log in again.');
        setLoading(false);
        navigate('/login');
      }
    } else {
      setError('No authToken found');
      navigate('/login');
    }
  }, [navigate]);

  const handleParentSelect = (e) => {
    setSelectedChild(e.target.value);
  };

  // Fetch attendance data for selected student
  useEffect(() => {
    if (selectedChild) {
      const fetchAttendanceData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `http://192.168.0.103:3000/attendance?studentId=${selectedChild}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch attendance data from server');
          }

          const data = await response.json();
          const filteredData = Array.isArray(data)
            ? data.filter((record) => record.date !== null)
            : [];

          setAttendanceData(filteredData);
        } catch (error) {
          console.error(error);
          setError('');
          setAttendanceData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceData();
    } else {
      setAttendanceData([]);
    }
  }, [selectedChild]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <Header />
      <div className="attendance-page">
        <h1>Attendance</h1>
        <div className="select-student">
          <label htmlFor="student-select">Select Your Child:</label>
          <select id="student-select" onChange={handleParentSelect} value={selectedChild}>
            <option value="">-- Select --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {selectedChild && (
          <div className="attendance-records">
            <h2>
              Attendance Records for{' '}
              {students.find((student) => student.id === parseInt(selectedChild))?.name}
            </h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Presence</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.length > 0 ? (
                    attendanceData.map((attendance) => (
                      <tr key={attendance.id}>
                        <td>{attendance.date || 'No Date'}</td>
                        <td style={{ color: attendance.present ? 'green' : 'red' }}>
                          {attendance.present ? 'Present' : 'Absent'}
                        </td>
                        <td>{attendance.classEntity?.className || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: 'gray' }}>
                        ❌ No attendance data found for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
