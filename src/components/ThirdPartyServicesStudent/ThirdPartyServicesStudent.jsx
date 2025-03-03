import React, { useEffect, useState } from 'react';
import Sidebar from '../SideNav/SideNav';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token
import './ThirdPartyServicesStudent.css';
import Header from '../Header/Header';

const ThirdPartyServicesStudent = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);

  // Decode the JWT token to get the studentId
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken); // Check the decoded token
        setStudentId(decodedToken.Id); // Set the studentId from decoded token
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
      }
    }
  }, []);

  // Fetch the student data once studentId is available
  useEffect(() => {
    if (studentId) {
      const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.0.103:3000/third-party-services');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const filteredData = data.find(student => student.studentId === studentId);
          setStudentData(filteredData);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [studentId]); // Re-fetch if studentId is updated

  return (
    <div className='for-header'>
      <Header />
      <div className="page-containerss">
        <Sidebar studentId={studentId} />
        <div className="student-details">
          {/* Conditional rendering based on loading, error, and studentData */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : studentData ? (
            <>
              <h1>Third Party Optional Services</h1>
              <h2>{studentData.studentName}</h2>
              <p>Email: {studentData.email}</p>
              <p>Phone No: {studentData.phoneNo}</p>
              <p>Status: {studentData.status}</p>
              <h3>Selected Services:</h3>
              <ul>
                {studentData.selectedServices.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>No data found for student ID {studentId}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyServicesStudent;
