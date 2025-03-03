import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import './Chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRedo } from '@fortawesome/free-solid-svg-icons'; 
import Header from '../Header/Header';

function Chatbot() {
  const { studentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch student messages by student ID
        const studentMessagesResponse = await fetch(`http://192.168.0.103:3000/messages/student/${studentId}`);
        if (!studentMessagesResponse.ok) {
          throw new Error(`Student fetch error: ${studentMessagesResponse.status}`);
        }
        const studentMessages = await studentMessagesResponse.json();

        // Fetch admin ID
        const adminResponse = await fetch('http://192.168.0.103:3000/admin');
        if (!adminResponse.ok) {
          throw new Error(`Admin fetch error: ${adminResponse.status}`);
        }
        const adminData = await adminResponse.json();
        setAdminId(adminData.id);

        // Fetch admin messages by admin ID
        const adminMessagesResponse = await fetch(`http://192.168.0.103:3000/messages/admin/${adminData.id}`);
        if (!adminMessagesResponse.ok) {
          throw new Error(`Admin messages fetch error: ${adminMessagesResponse.status}`);
        }
        const adminMessages = await adminMessagesResponse.json();

        // Combine and sort messages by createdAt timestamp
        const combinedMessages = [...studentMessages, ...adminMessages].sort((a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
        );

        setMessages(combinedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. ' + error.message);
      }
    };

    fetchMessages();
  }, [studentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        // Send new message
        const response = await fetch('http://192.168.0.103:3000/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId: parseInt(studentId),
            content: newMessage,
            senderType: 'student',
          }),
        });

        if (!response.ok) {
          throw new Error(`Send message error: ${response.status}`);
        }

        const sentMessage = await response.json();
        console.log('Message sent:', sentMessage);

        // Refetch messages after sending a new one
        const studentMessagesResponse = await fetch(`http://192.168.0.103:3000/messages/student/${studentId}`);
        if (!studentMessagesResponse.ok) {
          throw new Error(`Student fetch error: ${studentMessagesResponse.status}`);
        }
        const studentMessages = await studentMessagesResponse.json();
        
        const adminMessagesResponse = await fetch(`http://192.168.0.103:3000/messages/admin/${adminId}`);
        if (!adminMessagesResponse.ok) {
          throw new Error(`Admin messages fetch error: ${adminMessagesResponse.status}`);
        }
        const adminMessages = await adminMessagesResponse.json();

        const combinedMessages = [...studentMessages, ...adminMessages].sort((a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
        );

        setMessages(combinedMessages);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message. ' + error.message);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      const studentMessagesResponse = await fetch(`http://192.168.0.103:3000/messages/student/${studentId}`);
      if (!studentMessagesResponse.ok) {
        throw new Error(`Student fetch error: ${studentMessagesResponse.status}`);
      }
      const studentMessages = await studentMessagesResponse.json();
      
      const adminMessagesResponse = await fetch(`http://192.168.0.103:3000/messages/admin/${adminId}`);
      if (!adminMessagesResponse.ok) {
        throw new Error(`Admin messages fetch error: ${adminMessagesResponse.status}`);
      }
      const adminMessages = await adminMessagesResponse.json();

      const combinedMessages = [...studentMessages, ...adminMessages].sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
      );

      setMessages(combinedMessages);
      setError(null);
    } catch (error) {
      console.error('Error refreshing messages:', error);
      setError('Failed to refresh messages. ' + error.message);
    }
  };

  return (
    <div className='for-header'>
      <Header />
      <div className="teaching-staff">
        <SideNav studentId={studentId} />
        <div className='chat-head'>
          <h1>Teaching Staff</h1>
        </div>
        <div className="main-content">
          <div className="messages">
            {error && <p className="error-message">{error}</p>}
            {messages.length === 0 && !error && <p>No messages found.</p>}
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.senderType === 'student' ? 'student-message' : 'admin-message'}`}
              >
                <p>{msg.content}</p>
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            ))}
            <div ref={messagesEndRef} /> 
          </div>
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <div className="input-buttons">
              <button className="send-button" onClick={handleSendMessage}>
                <FontAwesomeIcon icon={faPaperPlane} className="iconssss" />
                Send
              </button>
              <button className="refreshed-button" onClick={handleRefresh}>
                <FontAwesomeIcon icon={faRedo} className="iconssss" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
