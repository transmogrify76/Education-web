import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateLeaveStatus.css';

const UpdateLeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch leave applications on component mount
    const fetchLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:3000/leaves'); // Adjust the URL as needed
        setLeaves(response.data);
        setError('');
      } catch (err) {
        setError('An error occurred while fetching leave applications.');
      }
    };

    fetchLeaves();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/leaves/${id}`, { status: newStatus }); // Adjust the URL as needed
      setSuccess('Leave status updated successfully!');
      setError('');
      // Update the state with the new status
      setLeaves(leaves.map(leave => (leave.id === id ? { ...leave, status: newStatus } : leave)));
    } catch (err) {
      setError('An error occurred while updating the leave status.');
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Update Leave Status</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <table className="leave-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.name}</td>
              <td>{leave.rollNo}</td>
              <td>{leave.class_}</td>
              <td>{leave.fromDate}</td>
              <td>{leave.toDate}</td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              <td>
                <button
                  className="button-submit"
                  onClick={() => handleStatusChange(leave.id, 'Approved')}
                >
                  Approve
                </button>
                <button
                  className="button-submit"
                  onClick={() => handleStatusChange(leave.id, 'Rejected')}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateLeaveStatus;
