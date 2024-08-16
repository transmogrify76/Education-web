import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateTc.css';

const UpdateTc = () => {
  const [transferRequests, setTransferRequests] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    // Fetch transfer requests from the API
    axios.get('http://localhost:3000/transfer-requests')
      .then(response => {
        // Sort requests by updatedAt in descending order
        const sortedRequests = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTransferRequests(sortedRequests);
      })
      .catch(error => {
        console.error('Error fetching transfer requests:', error);
      });
  }, []);

  const handleStatusChange = (id, status) => {
    axios.patch(`http://localhost:3000/transfer-requests/${id}`, { status })
      .then(response => {
        setStatusUpdate(prevState => ({ ...prevState, [id]: status }));
        // Optionally, refresh the transfer requests list after update
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  return (
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
              <td className={`status ${statusUpdate[request.id] || request.status}`}>
                {statusUpdate[request.id] || request.status}
              </td>
              <td>
                {/* Conditionally render buttons based on status */}
                {statusUpdate[request.id] === 'Accepted' || statusUpdate[request.id] === 'Declined' || request.status === 'Accepted' || request.status === 'Declined' ? null : (
                  <>
                    <button onClick={() => handleStatusChange(request.id, 'Accepted')}>
                      Accept
                    </button>
                    <button onClick={() => handleStatusChange(request.id, 'Declined')}>
                      Decline
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateTc;
