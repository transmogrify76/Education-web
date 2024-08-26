import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import './Chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // Changed to paper plane for send button
import Header from '../Header/Header';

function Chatbot() {
  const { studentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch student messages
        const studentMessagesResponse = await fetch(`http://localhost:3000/messages/student/${studentId}`);
        const studentMessages = await studentMessagesResponse.json();
        console.log('Student messages:', studentMessages); // Log student messages

        // Fetch admin messages
        const adminMessagesResponse = await fetch('http://localhost:3000/messages/admin/35');
        const adminMessages = await adminMessagesResponse.json();
        console.log('Admin messages:', adminMessages); // Log admin messages

        // Combine messages
        setMessages([...studentMessages, ...adminMessages]);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages');
      }
    };

    fetchMessages();
  }, [studentId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        // Send new message
        const response = await fetch('http://localhost:3000/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId,
            message: newMessage,
          }),
        });
        const sentMessage = await response.json();
        console.log('Message sent:', sentMessage); // Log sent message

        // Fetch updated messages
        const studentMessagesResponse = await fetch(`http://localhost:3000/messages/student/${studentId}`);
        const studentMessages = await studentMessagesResponse.json();
        const adminMessagesResponse = await fetch('http://localhost:3000/messages/admin/35');
        const adminMessages = await adminMessagesResponse.json();

        setMessages([...studentMessages, ...adminMessages]);
        setNewMessage(''); // Clear input field
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
      }
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
              <div key={index} className="message">
                <p>{msg.text}</p>
                <span>{msg.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <button className="send-button" onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} className="iconssss" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
