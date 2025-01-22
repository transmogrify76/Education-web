import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import './Attendance.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom'; // For navigation to login if token is missing

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parentId, setParentId] = useState(null);
  const navigate = useNavigate();

  // Fetch parentId from JWT token and then fetch student data
  useEffect(() => {
    const authToken = localStorage.getItem('authToken'); // Assuming JWT is stored in localStorage
    if (authToken) {
      try {
        // Decode the JWT token to get the parentId
        const decodedToken = jwtDecode(authToken);
        const parentIdFromToken = decodedToken.id; // Assuming the parentId is in the payload
        setParentId(parentIdFromToken);

        // Fetch student data based on parentId
        const fetchStudentData = async () => {
          try {
            const response = await fetch(`http://localhost:3000/parent/${parentIdFromToken}`);
            if (!response.ok) {
              throw new Error('Failed to fetch student data');
            }
            const data = await response.json();
            setStudents(data.students || []);
          } catch (error) {
            setError('Error fetching student data');
            console.error(error);
          } finally {
            setLoading(false);
          }
        };

        fetchStudentData();
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setError('Failed to decode authToken');
        setLoading(false); // Stop loading if token decoding fails
      }
    } else {
      setError('No authToken found');
      navigate('/login'); // Redirect to login page if token is missing
    }
  }, [navigate]);

  const handleParentSelect = (e) => {
    setSelectedChild(e.target.value);
  };

  const fetchAttendance = async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      setAttendanceData(data); // Store the attendance data
    } catch (error) {
      setError('Error fetching attendance data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = students.find(student => student.id === selectedChild);

  useEffect(() => {
    if (selectedChild) {
      fetchAttendance(selectedChild); // Fetch attendance when student is selected
    }
  }, [selectedChild]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Header />
      <div className="attendance-page">
        <h1>Attendance</h1>
        <div className="select-student">
          <label htmlFor="student-select">Select Your Child:</label>
          <select id="student-select" onChange={handleParentSelect}>
            <option value="">-- Select --</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        {selectedChild && selectedStudent && (
          <div className="attendance-records">
            <h2>Attendance Records for {selectedStudent.name}</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Presence</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map(record => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.present ? 'Present' : 'Absent'}</td>
                    </tr>
                  ))}
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
