import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected the import
import './StudentGradesPage.css';
import SideNav from '../SideNav/SideNav';
import Header from '../Header/Header';

// Utility function to check token expiration
const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  const expirationDate = decodedToken.exp * 1000; // Convert exp to milliseconds
  return Date.now() >= expirationDate;
};

const StudentGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGradesAndStudentName = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No auth token found');
          setLoading(false);
          return;
        }

        // Decode the token to get the studentId
        const decodedToken = jwtDecode(token);
        const studentId = decodedToken.Id; // Assuming the studentId is part of the token

        if (!studentId) {
          setError('No student ID found in token');
          setLoading(false);
          return;
        }

        // Check if the token has expired
        if (isTokenExpired(token)) {
          setError('Token expired');
          setLoading(false);
          return;
        }

        // Configure headers with Authorization token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch grades
        const gradesResponse = await axios.get(
          `http://localhost:3000/grading/student/${studentId}`,
          config
        );

        if (gradesResponse.status === 404) {
          setError('No grades found for this student.');
          setLoading(false);
          return;
        }

        setGrades(gradesResponse.data);

        // Fetch student details to get the student name
        const studentResponse = await axios.get(
          `http://localhost:3000/student/${studentId}`,
          config
        );

        setStudentName(studentResponse.data.name);
        setLoading(false);
      } catch (err) {
        // Check if the error is a network error or server error
        if (!err.response) {
          setError('Network error. Please try again.');
        } else {
          setError(err.response.data.message || 'Error fetching data');
        }
        setLoading(false);
      }
    };

    fetchGradesAndStudentName();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="for-header">
      <Header />
      <div className="dashboard-containers">
        <SideNav />
        <div className="student-grades-container">
          <h1>Grades for {studentName}</h1>
          <ul>
            {grades.length > 0 ? (
              grades.map((gradeItem) => (
                <li key={gradeItem.id} className="grade-item">
                  <strong className="subject-title">Subject: {gradeItem.subject}</strong>
                  <div className="assignment-name">Assignment: {gradeItem.assignmentName}</div>
                  <div className="grade-value">Grade: {gradeItem.grade}</div>
                  <div className="remarks">Remarks: {gradeItem.remarks}</div>
                  <p className="timestamp">{new Date(gradeItem.createdAt).toLocaleString()}</p>
                </li>
              ))
            ) : (
              <p>No grades available for this student.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentGradesPage;
