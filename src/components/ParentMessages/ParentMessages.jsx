import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token
import './ParentMessages.css';
import Header from '../Header/Header';

const ParentMessages = () => {
  const [messages, setMessages] = useState([]);
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessagesAndParentName = async () => {
      try {
        // Get the authToken from localStorage
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          // Decode the token to get the parentId
          const decodedToken = jwtDecode(authToken);
          const parentId = decodedToken.id;

          // Fetch messages for the parent
          const messagesResponse = await axios.get(`http://192.168.0.103:3000/communication/communication-records/parent/${parentId}`);
          setMessages(messagesResponse.data);

          // Fetch parent details to get the name
          const parentResponse = await axios.get(`http://192.168.0.103:3000/parent/${parentId}`);
          setParentName(parentResponse.data.name);

          setLoading(false);
        } else {
          throw new Error('No authToken found');
        }
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchMessagesAndParentName(); // Fetch messages and parent info
  }, []);

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
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
