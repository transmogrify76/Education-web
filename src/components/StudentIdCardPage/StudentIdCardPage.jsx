import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import './StudentIdCardPage.css';
import Header from '../Header/Header';

const StudentIdCardPage = () => {
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Decode the JWT token to get the parentId
        const decodedToken = jwtDecode(authToken);
        const parentId = decodedToken.id;

        const fetchStudentData = async () => {
          console.log('Fetching data for parentId:', parentId); // Debug log
          try {
            const response = await fetch(`http://localhost:3000/parent/${parentId}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Debug log
            setStudentData(data.students || []);
          } catch (error) {
            console.error('Error fetching student data:', error);
            setError('Failed to fetch student data.');
          } finally {
            setLoading(false);
          }
        };

        fetchStudentData();
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setLoading(false); // Stop loading even if decoding fails
      }
    } else {
      console.error('No authToken found in localStorage');
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseCard = () => {
    setSelectedStudent(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (studentData.length === 0) {
    return <p>No student data available.</p>;
  }

  return (
    <div>
      <Header />
      <div className="id-card-page-container">
        <h1>Student ID Cards</h1>
        <div className="student-list">
          {studentData.map(student => (
            <button
              key={student.id}
              className="student-name-btn"
              onClick={() => handleStudentClick(student)}
            >
              {student.name}
            </button>
          ))}
        </div>
        {selectedStudent && (
          <div className="id-card-container">
            <div id="id-card" className="id-card">
              <h2>ID Card</h2>
              <div className="id-card-field"><strong>Name:</strong> {selectedStudent.name}</div>
              <div className="id-card-field"><strong>Enrollment No:</strong> {selectedStudent.enrollmentNo}</div>
              <div className="id-card-field"><strong>Date of Birth:</strong> {new Date(selectedStudent.dob).toLocaleDateString()}</div>
              <div className="id-card-field"><strong>Address:</strong> {selectedStudent.address}</div>
              <div className="id-card-field"><strong>School Name:</strong> Edu_web</div>
              <button className="close-btn" onClick={handleCloseCard}>Close</button>
              {/* Disabled PDF download button */}
              {/* <button className="download-btn" onClick={handleDownload}>
                Download PDF
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentIdCardPage;
