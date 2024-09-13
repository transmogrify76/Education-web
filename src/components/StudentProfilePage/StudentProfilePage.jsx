import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudentProfilePage.css';
import Header from '../Header/Header'

const StudentProfilePage = () => {
  const { parentId } = useParams();
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchStudentData();
  }, [parentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (studentData.length === 0) {
    return <p>No student data available.</p>;
  }

  return (
    <div>
    <Header/>
    <div className="student-profile-container">
      <h1>Student Profiles</h1>
      {studentData.map(student => (
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
