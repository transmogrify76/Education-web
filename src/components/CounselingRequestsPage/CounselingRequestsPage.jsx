import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CounselingRequestsPage.css';
import Header from '../Header/Header';

const CounselingRequestsPage = () => {
  const [counselingRequests, setCounselingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch counseling requests when the component mounts
  useEffect(() => {
    const fetchCounselingRequests = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/counseling-request');
        setCounselingRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching counseling requests:', error);
        setFetchError('Failed to fetch counseling requests.');
        setLoading(false);
      }
    };

    fetchCounselingRequests();
  }, []);

  return (
    <div>
      <Header />
      <div className="counseling-request-container">
        <h1 className="counseling-request-title">Counseling Requests</h1>

        {/* Loading or error state */}
        {loading && <p className="loading-text">Loading...</p>}
        {fetchError && <p className="error-message">{fetchError}</p>}

        {/* List of counseling requests */}
        {!loading && !fetchError && counselingRequests.length > 0 && (
          <table className="request-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Area of Concern</th>
                <th>Description</th>
                <th>Frequency</th>
                <th>Support Required From</th>
                <th>Expected Support</th>
              </tr>
            </thead>
            <tbody>
              {counselingRequests.map((request) => (
                <tr key={request.id} className="request-row">
                  <td>{request.id}</td>
                  <td>{request.student.name}</td> {/* Accessing student name directly */}
                  <td>{request.areaOfConcern}</td>
                  <td>{request.description}</td>
                  <td>{request.frequency}</td>
                  <td>{request.supportRequiredFrom}</td>
                  <td>{request.expectedSupport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* If there are no requests */}
        {!loading && !fetchError && counselingRequests.length === 0 && (
          <p className="no-requests-message">No counseling requests available.</p>
        )}
      </div>
    </div>
  );
};

export default CounselingRequestsPage;
