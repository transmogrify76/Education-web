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
  
  useEffect(() => {
    // Fetch all exit slips data on component mount
    axios.get('http://localhost:3000/exit-slip')
      .then(response => {
        setExitSlips(response.data);  // Set the fetched data to the state
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching exit slips:', error);
        setError('Failed to fetch exit slip requests.');
      });
  }, []);

  const handleStatusChange = (id, status) => {
    axios.patch(`http://localhost:3000/exit-slip/${id}`, { status })
      .then(() => {
        setStatusUpdate(prevState => ({ ...prevState, [id]: status }));
        setError(null);
      })
      .catch(error => {
        console.error('Error updating status:', error);
        setError('Failed to update status.');
      });
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

    // Attach file only if there is one
    if (replyAttachment[id]) {
      formData.append('attachment', replyAttachment[id]);
    }

    axios.post(`http://localhost:3000/exit-slip/reply/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Reply and attachment uploaded successfully');
        setError(null);
        // Update exit slip with new data from response
        setExitSlips(prevSlips => 
          prevSlips.map(slip => 
            slip.id === id ? { ...slip, ...response.data } : slip
          )
        );
      })
      .catch(error => {
        console.error('Error uploading reply attachment and message:', error);
        setError('Failed to upload reply message and attachment.');
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
                      onClick={() => window.open(`http://localhost:3000/${request.attachment}`, '_blank')}
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
                  {statusUpdate[request.id] === 'Approved' || statusUpdate[request.id] === 'Declined' || request.status === 'Approved' || request.status === 'Declined' ? null : (
                    <>
                      <button className="action-button" onClick={() => handleStatusChange(request.id, 'Approved')}>
                        Approve
                      </button>
                      <button className="action-button decline-button" onClick={() => handleStatusChange(request.id, 'Declined')}>
                        Decline
                      </button>
                      <button onClick={() => handleReplySubmit(request.id)} className="reply-button">
                        Submit Reply
                      </button>
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
