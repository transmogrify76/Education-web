import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransportRequestUpdatePage.css';

const TransportRequestUpdatePage = () => {
  const [transportRequests, setTransportRequests] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/transport-request')
      .then(response => {
        const sortedRequests = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTransportRequests(sortedRequests);
      })
      .catch(error => {
        console.error('Error fetching transport requests:', error);
      });
  }, []);

  const handleStatusChange = (id, status) => {
    axios.patch(`http://localhost:3000/transport-request/${id}/status`, { status })
      .then(response => {
        console.log('Status updated:', response.data); // Log response for debugging
        setTransportRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === id ? { ...request, status } : request
          )
        );
        setStatusUpdate(prevState => ({ ...prevState, [id]: status }));
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <div className="transport-request-page">
      <h2>Transport Request Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Parent Name</th>
            <th>Pickup Location</th>
            <th>Dropoff Location</th>
            <th>Additional Info</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transportRequests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.student.name}</td>
              <td>{request.parentName}</td>
              <td>{request.pickupLocation}</td>
              <td>{request.dropoffLocation}</td>
              <td>{request.additionalInfo}</td>
              <td className={`status ${statusUpdate[request.id] || request.status}`}>
                {statusUpdate[request.id] || request.status}
              </td>
              <td>
                {(statusUpdate[request.id] === 'Approved' || statusUpdate[request.id] === 'Rejected' || request.status === 'Approved' || request.status === 'Rejected') ? null : (
                  <>
                    <div 
                      className="action approve" 
                      onClick={() => handleStatusChange(request.id, 'Approved')}
                    >
                      Approve
                    </div>
                    <div 
                      className="action reject" 
                      onClick={() => handleStatusChange(request.id, 'Rejected')}
                    >
                      Reject
                    </div>
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

export default TransportRequestUpdatePage;
