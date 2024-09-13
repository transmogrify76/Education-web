import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ParentMessages.css';
import Header from '../Header/Header';
// Assuming you have a parent-specific SideNav


const ParentMessages = () => {
  const { parentId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessagesAndParentName = async () => {
      try {
        // Fetch messages
        const messagesResponse = await axios.get(`http://localhost:3000/communication/communication-records/parent/${parentId}`);
        setMessages(messagesResponse.data);

        // Fetch parent details to get the name
        const parentResponse = await axios.get(`http://localhost:3000/parent/${parentId}`);
        setParentName(parentResponse.data.name);

        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    if (parentId) {
      fetchMessagesAndParentName();
    } else {
      setError('No parent ID provided');
      setLoading(false);
    }
  }, [parentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header/>
    {/* // <div className="dashboard-container">
    //     <SideNav parentId={parentId} /> */}
    
    <div className="parent-messages-container">
      <h1>Messages for {parentName}</h1>
      <ul>
        {messages.length > 0 ? (
          messages.map(message => (
            <li key={message.id} className="message-item">
              <strong className="message-title">{message.title}</strong>
              <div className="message-content">{message.content}</div>
              {message.sender && (
                <p className="teacher-info">Sent by: {message.sender.name}</p>
              )}
              <p className="timestamp">{new Date(message.createdAt).toLocaleString()}</p>
            </li>
          ))
        ) : (
          <p>No messages found.</p>
        )}
      </ul>
    </div>
    </div>
  );
};

export default ParentMessages;
