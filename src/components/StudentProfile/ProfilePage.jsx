import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import './ProfilePage.css';
import Header from '../Header/Header'; // Assuming you have a Header component
import Sidebar from '../SideNav/SideNav'; // Assuming you have a Sidebar component
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const location = useLocation();
  const studentId = location.state?.studentId; 
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('No token found in localStorage');
          return;
        }
        const decodedToken = jwtDecode(token);
        const studentId = decodedToken.Id; 
        console.log('Decoded studentId:', studentId); 
        const response = await axios.get(`http://192.168.0.103:3000/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        if (response.data) {
          setStudentData(response.data); 
        } else {
          console.log('No student data returned from the API');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchStudentData(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!studentData) {
    return <div>No student data found.</div>; 
  }

  return (
    <div className='for-header'>
      <Header />
      <div className='side-with'>
        <Sidebar studentId={studentId} />
        
        <div className="profile-container">
          <div className="profile-headerer">
            <h1>Student Profile</h1>
            <p>Enrollment No: {studentData.enrollmentNo}</p>
          </div>
          <div className="profile-infos">
            <p><strong>Name:</strong> {studentData.name}</p> 
            <p><strong>Email:</strong> {studentData.parent.email}</p> 
            <p><strong>Roll Number:</strong> {studentData.rollNo}</p> 
            <p><strong>Class:</strong> {studentData.class.className}</p> 
            <p><strong>Date of Birth:</strong> {new Date(studentData.dob).toLocaleDateString()}</p> 
            <p><strong>Address:</strong> {studentData.address}</p> 
            <p><strong>Parent Name:</strong> {studentData.parent.name}</p> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
