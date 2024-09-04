import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StudentMessages.css';
import SideNav from '../SideNav/SideNav';
import Header from '../Header/Header';

const StudentMessages = () => {
  const { studentId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessagesAndStudentName = async () => {
      try {
        // Fetch messages
        const messagesResponse = await axios.get(`http://localhost:3000/communication/communication-records/student/${studentId}`);
        setMessages(messagesResponse.data);

        // Fetch student details to get the name
        const studentResponse = await axios.get(`http://localhost:3000/student/${studentId}`);
        setStudentName(studentResponse.data.name);

        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    if (studentId) {
      fetchMessagesAndStudentName();
    } else {
      setError('No student ID provided');
      setLoading(false);
    }
  }, [studentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='for-header'>
      <Header/>
    <div className="dashboard-containers">
        <SideNav studentId={studentId} />
    
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
