import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExitSlipUpdate.css'; 
import Header from '../Header/Header';

const ExitSlipUpdate = () => {
  const [exitSlips, setExitSlips] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [error, setError] = useState(null);
  const [replyAttachment, setReplyAttachment] = useState({}); 
  useEffect(() => {
    
    axios.get('http://localhost:3000/exit-slip')
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
    axios.patch(`http://localhost:3000/exit-slip/${id}`, { status })
      .then(response => {
        setStatusUpdate(prevState => ({ ...prevState, [id]: status }));
      })
      .catch(error => {
        console.error('Error updating status:', error);
        setError('Failed to update status.'); 
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
        console.log('Reply attachment uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading reply attachment:', error);
        setError('Failed to upload reply attachment.'); 
      });
  };

  
  const getBlobUrlFromBase64 = (base64String) => {
    try {
      // Ensure the base64 string is valid
      const trimmedString = base64String.trim();
      if (trimmedString.length % 4 === 0) {
        const binaryString = atob(trimmedString);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' }); // Change type if necessary
        return URL.createObjectURL(blob);
      } else {
        console.error("Invalid base64 string");
        return null;
      }
    } catch (error) {
      console.error("Decoding error:", error);
      return null;
    }
  };

  // Function to download the PDF
  const downloadPDF = (base64String, fileName) => {
    const blobUrl = getBlobUrlFromBase64(base64String);
    if (blobUrl) {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName; // Set the desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Clean up the URL object
    } else {
      console.error('Failed to create Blob URL');
    }
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
                    <a 
                      href={`http://localhost:3000/${request.attachment}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Attachment
                    </a>
                  )}
                  {request.base64Attachment && ( // Assuming base64Attachment is the property with the base64 string
                    <button onClick={() => downloadPDF(request.base64Attachment, `attachment_${request.id}.pdf`)}>
                      Download PDF
                    </button>
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
