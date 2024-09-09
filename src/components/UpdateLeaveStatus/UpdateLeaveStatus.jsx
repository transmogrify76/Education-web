import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateLeaveStatus.css';

const UpdateLeaveStatus = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetching leave requests from the server
  useEffect(() => {
    axios.get('http://localhost:3000/leaves')
      .then(response => {
        const sortedRequests = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setLeaveRequests(sortedRequests);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
      });
  }, []);

  // Handle status change by sending PATCH request to the correct endpoint
  const handleStatusChange = (id, status) => {
    axios.patch(`http://localhost:3000/leaves/${id}/status`, { status })  // Updated URL
      .then(() => {
        setLeaveRequests(prevRequests =>
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
    <div className="leave-request-page">
      <h2>Leave Request Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Parent Name</th>
            <th>Parent Email</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.studentName || 'N/A'}</td>
              <td>{request.parentName || 'N/A'}</td>
              <td>{request.parentEmail || 'N/A'}</td>
              <td>{new Date(request.fromDate).toLocaleDateString()}</td>
              <td>{new Date(request.toDate).toLocaleDateString()}</td>
              <td>{request.reason || 'No reason provided'}</td>
              <td className={`status ${request.status}`}>
                {request.status}
              </td>
              <td>
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
  );
};

export default UpdateLeaveStatus;
