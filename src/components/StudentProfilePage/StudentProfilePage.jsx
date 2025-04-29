import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './StudentProfilePage.css';
import Header from '../Header/Header';

const StudentProfilePage = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        const parentId = decodedToken.id;

        const fetchStudentData = async () => {
          console.log('Fetching data for parentId:', parentId);
          try {
            const response = await fetch(`http://192.168.0.103:3000/parent/${parentId}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            setStudentData(data.students || []);
          } catch (error) {
            console.error('Error fetching student data:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchStudentData();
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setLoading(false);
      }
    } else {
      console.error('No authToken found in localStorage');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (studentData.length === 0) {
    return <p>No student data available.</p>;
  }

  // Sorting the students by class number in ascending order
  const sortedStudentData = studentData.sort((a, b) => {
    return parseInt(a.class.className) - parseInt(b.class.className);
  });

  return (
    <div>
      <Header />
      <div className="student-profile-container">
        <h1>Student Profiles</h1>
        {sortedStudentData.map((student) => (
          <div className="profile-card" key={student.id}>
            <div className="profile-field"><strong>ID:</strong> {student.id}</div>
            <div className="profile-field"><strong>Name:</strong> {student.name}</div>
            <div className="profile-field"><strong>Enrollment No:</strong> {student.enrollmentNo}</div>
            <div className="profile-field"><strong>Email:</strong> {student.email}</div>
            <div className="profile-field"><strong>Roll No:</strong> {student.rollNo}</div> {/* Added roll number */}
            <div className="profile-field"><strong>Class:</strong> {student.class.className}</div> {/* Added class */}
            <div className="profile-field"><strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}</div>
            <div className="profile-field"><strong>Address:</strong> {student.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfilePage;
