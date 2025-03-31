import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import './StudentMessages.css';
import SideNav from '../SideNav/SideNav';
import Header from '../Header/Header';

const StudentMessages = () => {
  const [messages, setMessages] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessagesAndStudentName = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No auth token found');
          setLoading(false);
          return;
        }

        // Decode the token to get the studentId
        const decodedToken = jwtDecode(token);
        const studentId = decodedToken.Id; // assuming the studentId is part of the token

        if (!studentId) {
          setError('No student ID found in token');
          setLoading(false);
          return;
        }

        // Check token expiration
        const isExpired = Date.now() >= decodedToken.exp * 1000;
        if (isExpired) {
          setError('Token expired');
          setLoading(false);
          return;
        }

        // Add token to Authorization header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch messages
        const messagesResponse = await axios.get(`http://192.168.0.103:3000/communication/communication-records/student/${studentId}`, config);
        setMessages(messagesResponse.data);

        // Fetch student details to get the name
        const studentResponse = await axios.get(`http://192.168.0.103:3000/student/${studentId}`, config);
        setStudentName(studentResponse.data.name);

        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchMessagesAndStudentName();

  }, []);

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='for-header'>
      <Header />
      <div className="dashboard-containers">
        <SideNav />
        <div className="student-messages-container">
          <h1>Messages for {studentName}</h1>
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
    </div>
  );
};

export default StudentMessages;
