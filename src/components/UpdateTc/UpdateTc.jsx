import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateTc.css';
import Header from '../Header/Header';

const UpdateTc = () => {
  const [transferRequests, setTransferRequests] = useState([]);

  useEffect(() => {
    // Fetch the transfer requests and sort them by updatedAt date, with the most recent first
    axios.get('http://localhost:3000/transfer-requests')
      .then(response => {
        const sortedRequests = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTransferRequests(sortedRequests);
      })
      .catch(error => {
        console.error('Error fetching transfer requests:', error);
      });
  }, []);

  const handleStatusChange = (id, status) => {
    // Update the status of the transfer request in the database
    axios.patch(`http://localhost:3000/transfer-requests/${id}`, { status })
      .then(response => {
        // Update the status in the transferRequests state to reflect the change immediately
        setTransferRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === id ? { ...request, status } : request
          )
        );
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <div>
      <Header/>
    <div className="transfer-request-page">
      <h2>Transfer Request Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Current Class</th>
            <th>New Class</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transferRequests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.name}</td>
              <td>{request.currentClass}</td>
              <td>{request.newClass}</td>
              <td>{request.reason}</td>
              <td className={`status ${request.status}`}>
                {request.status}
              </td>
              <td>
                {/* Show actions only if the status is not already 'Accepted' or 'Declined' */}
                {(request.status !== 'Accepted' && request.status !== 'Declined') && (
                  <>
                    <div
                      className="action accept"
                      onClick={() => handleStatusChange(request.id, 'Accepted')}
                    >
                      Accept
                    </div>
                    <div
                      className="action decline"
                      onClick={() => handleStatusChange(request.id, 'Declined')}
                    >
                      Decline
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default UpdateTc;
