import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExitSlipUpdate.css'; 
import Header from '../Header/Header';

const ExitSlipUpdate = () => {
  const [exitSlips, setExitSlips] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [error, setError] = useState(null);
  const [replyAttachment, setReplyAttachment] = useState({});
  const [replies, setReplies] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch exit slips on component mount
  useEffect(() => {
    axios.get('http://192.168.0.103:3000/exit-slip')
      .then(response => {
        setExitSlips(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching exit slips:', error);
        setError('Failed to fetch exit slip requests.');
      });
  }, []);

  const handleStatusChange = (id, status) => {
    setStatusUpdate(prevState => ({ ...prevState, [id]: status }));
  };

  const handleReplyChange = (id, reply) => {
    setReplies(prevState => ({
      ...prevState,
      [id]: reply,
    }));
  };

  const handleReplyAttachmentChange = (id, event) => {
    setReplyAttachment(prevState => ({
      ...prevState,
      [id]: event.target.files[0],
    }));
  };

  const handleReplySubmit = (id) => {
    const formData = new FormData();
    formData.append('status', statusUpdate[id] || 'Pending');
    formData.append('reply', replies[id] || '');

    if (replyAttachment[id]) {
      formData.append('adminAttachment', replyAttachment[id]);
    }

    axios.patch(`http://192.168.0.103:3000/exit-slip/${id}/admin-reply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        setExitSlips(prevSlips => 
          prevSlips.map(slip => 
            slip.id === id ? { ...slip, ...response.data } : slip
          )
        );
        setSuccessMessage('Reply, status, and attachment saved successfully');
        setError(null);
      })
      .catch(error => {
        console.error('Error saving reply, status, and attachment:', error);
        setError('Failed to save reply, status, and attachment.');
      });
  };

  return (
    <div>
      <Header />
      <div className="exit-slip-update-page">
        <h2>Exit Slip Request Management</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
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
              <th>Reply</th>
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
                  {request.reply ? (
                    <p>{request.reply}</p>
                  ) : (
                    <textarea
                      placeholder="Write a reply"
                      value={replies[request.id] || ''}
                      onChange={(e) => handleReplyChange(request.id, e.target.value)}
                      className="reply-textarea"
                    />
                  )}
                </td>
                <td>
                  {request.attachment && (
                    <button 
                      onClick={() => window.open(`http://192.168.0.103:3000/${request.attachment}`, '_blank')}
                      className="view-attachment-button"
                    >
                      View Attachment
                    </button>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleReplyAttachmentChange(request.id, e)}
                    className="file-upload"
                  />
                </td>
                <td>
                  <select
                    onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    value={statusUpdate[request.id] || request.status}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                  <button 
                    onClick={() => handleReplySubmit(request.id)} 
                    className="reply-button"
                    disabled={!replies[request.id] && !replyAttachment[request.id] && !statusUpdate[request.id]}
                  >
                    Submit Reply
                  </button>
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
