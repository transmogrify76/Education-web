import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExitSlipUpdate.css'; // Make sure to create a corresponding CSS file

const ExitSlipUpdate = () => {
  const [exitSlips, setExitSlips] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch exit slip requests from the API
    axios.get('http://localhost:3000/exit-slip')
      .then(response => {
        setExitSlips(response.data);
        setError(null); // Clear any previous errors
      })
      .catch(error => {
        console.error('Error fetching exit slips:', error);
        setError('Failed to fetch exit slip requests.'); // Set an error message
      });
  }, []);

  const handleStatusChange = (id, status) => {
    axios.patch(`http://localhost:3000/exit-slip/${id}`, { status })
      .then(response => {
        setStatusUpdate(prevState => ({ ...prevState, [id]: status }));
      })
      .catch(error => {
        console.error('Error updating status:', error);
        setError('Failed to update status.'); // Set an error message
      });
  };

  return (
    <div className="exit-slip-update-page">
      <h2>Exit Slip Request Management</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Time</th>
            <th>Parent Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exitSlips.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.studentName}</td>
              <td>{request.reason}</td>
              <td>{request.date}</td>
              <td>{request.time}</td>
              <td>{request.parentContact}</td>
              <td className={`status ${statusUpdate[request.id] || request.status}`}>
                {statusUpdate[request.id] || request.status}
              </td>
              <td>
                {statusUpdate[request.id] === 'Approved' || statusUpdate[request.id] === 'Declined' || request.status === 'Approved' || request.status === 'Declined' ? null : (
                  <>
                    <button onClick={() => handleStatusChange(request.id, 'Approved')}>
                      Approve
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

export default ExitSlipUpdate;
