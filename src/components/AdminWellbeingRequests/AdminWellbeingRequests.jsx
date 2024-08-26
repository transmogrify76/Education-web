import React, { useState, useEffect } from 'react';
import './AdminWellbeingRequests.css';
import Header from '../Header/Header';

const AdminWellbeingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:3000/student-wellbeing');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();

        // Debug: Log the fetched data
        console.log('Fetched data:', data);

        // Ensure the correct field is used for sorting
        const sortedRequests = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Debug: Log the sorted data
        console.log('Sorted data:', sortedRequests);

        setRequests(sortedRequests);
      } catch (error) {
        setError('Error fetching requests: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-management-page">
      <Header />
      <div className="container">
        <h2>Student Wellbeing Requests</h2>
        <table className="requests-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Enrollment Number</th>
              <th>Class</th>
              <th>Difficulty Message</th>
              <th>Talk Briefly Message</th>
              <th>Problem Solving Message</th>
              <th>Help Option</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.studentId}>
                <td>{request.studentId}</td>
                <td>{request.name}</td>
                <td>{request.enrollmentNumber}</td>
                <td>{request.class}</td>
                <td>{request.difficultyMessage}</td>
                <td>{request.talkBrieflyMessage}</td>
                <td>{request.problemSolvingMessage}</td>
                <td>{request.helpOption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWellbeingRequests;
