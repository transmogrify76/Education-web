import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExitSlipUpdate.css'; // Ensure you have the corresponding CSS file
import Header from '../Header/Header';

const ExitSlipUpdate = () => {
  const [exitSlips, setExitSlips] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [error, setError] = useState(null);
  const [replyAttachment, setReplyAttachment] = useState({}); // To hold admin reply attachments

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

  const handleReplyAttachmentChange = (id, event) => {
    setReplyAttachment(prevState => ({
      ...prevState,
      [id]: event.target.files[0]
    }));
  };

  const handleReplySubmit = (id) => {
    const formData = new FormData();
    formData.append('attachment', replyAttachment[id]);
    
    axios.post(`http://localhost:3000/exit-slip/reply/${id}`, formData)
      .then(response => {
        // Handle success (e.g., refresh the state or display a message)
        console.log('Reply attachment uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading reply attachment:', error);
        setError('Failed to upload reply attachment.'); // Set an error message
      });
  };

  return (
    <div>
      <Header />
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
              <th>Attachment</th>
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
                  {request.attachment && (
                    <a href={`http://localhost:3000/${request.attachment}`} target="_blank" rel="noopener noreferrer">
                      View Attachment
                    </a>
                  )}
                </td>
                <td>
                  {statusUpdate[request.id] === 'Approved' || statusUpdate[request.id] === 'Declined' || request.status === 'Approved' || request.status === 'Declined' ? null : (
                    <>
                      <div className="action-button" onClick={() => handleStatusChange(request.id, 'Approved')}>
                        Approve
                      </div>
                      <div className="action-button decline-button" onClick={() => handleStatusChange(request.id, 'Declined')}>
                        Decline
                      </div>
                      <input type="file" onChange={(e) => handleReplyAttachmentChange(request.id, e)} />
                      <button onClick={() => handleReplySubmit(request.id)}>Upload Reply</button>
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

export default ExitSlipUpdate;
