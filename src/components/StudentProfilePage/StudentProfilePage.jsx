import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import './StudentProfilePage.css';
import Header from '../Header/Header';

const StudentProfilePage = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the authToken from localStorage
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Decode the token to get the parentId
        const decodedToken = jwtDecode(authToken);
        const parentId = decodedToken.id; // Extract parentId from the decoded token

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
          } finally {
            setLoading(false);
          }
        };

        fetchStudentData(); // Fetch data for the parentId
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setLoading(false); // Stop loading even if decoding fails
      }
    } else {
      console.error('No authToken found in localStorage');
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (studentData.length === 0) {
    return <p>No student data available.</p>;
  }

  return (
    <div>
      <Header />
      <div className="student-profile-container">
        <h1>Student Profiles</h1>
        {studentData.map((student) => (
          <div className="profile-card" key={student.id}>
            <div className="profile-field"><strong>ID:</strong> {student.id}</div>
            <div className="profile-field"><strong>Name:</strong> {student.name}</div>
            <div className="profile-field"><strong>Enrollment No:</strong> {student.enrollmentNo}</div>
            <div className="profile-field"><strong>Email:</strong> {student.email}</div>
            <div className="profile-field"><strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}</div>
            <div className="profile-field"><strong>Address:</strong> {student.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfilePage;
