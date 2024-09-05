import React, { useEffect, useState } from 'react';
import Sidebar from '../SideNav/SideNav';
import { useParams } from 'react-router-dom';
import './ThirdPartyServicesStudent.css';
import Header from '../Header/Header';
const ThirdPartyServicesStudent = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/third-party-services');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const filteredData = data.find(student => student.studentId === parseInt(studentId));
        setStudentData(filteredData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!studentData) return <p>No data found for student ID {studentId}</p>;
  return (
    <div className='for-header'>
      <Header/>
    <div className="page-containerss">
      <Sidebar studentId={studentId} />
      <div className="student-details">
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
      </div>
    </div>
    </div>
  );
};

export default ThirdPartyServicesStudent;
