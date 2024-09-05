import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AdminChat.css';

const AdminChat = () => {
  const { adminId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null); // Reference to scroll to the bottom

  useEffect(() => {
    // Fetch all students on component mount
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/student');
        setStudents(response.data);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('Failed to fetch students.');
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchMessages(selectedStudent, adminId);
    }
  }, [selectedStudent, adminId]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (studentId, adminId) => {
    setLoading(true);
    try {
      // Fetch student messages
      const studentMessagesResponse = await fetch(`http://localhost:3000/messages/student/${studentId}`);
      if (!studentMessagesResponse.ok) {
        throw new Error(`Student fetch error: ${studentMessagesResponse.status}`);
      }
      const studentMessages = await studentMessagesResponse.json();

      // Fetch admin messages
      const adminMessagesResponse = await fetch(`http://localhost:3000/messages/admin/${adminId}?studentId=${studentId}`);
      if (!adminMessagesResponse.ok) {
        throw new Error(`Admin messages fetch error: ${adminMessagesResponse.status}`);
      }
      const adminMessages = await adminMessagesResponse.json();

      // Combine and sort messages by creation date (oldest first)
      const combinedMessages = [...studentMessages, ...adminMessages].sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)  // Sort in ascending order
      );

      setMessages(combinedMessages);
      setError('');
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (event) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      senderType: 'admin',  // Hardcoded as admin
      studentId: selectedStudent,
      adminId: adminId  // Use the adminId from URL
    };

    try {
      const response = await axios.post('http://localhost:3000/messages', messageData);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message.');
    }
  };

  const handleRefresh = () => {
    if (selectedStudent) {
      fetchMessages(selectedStudent, adminId);
    }
  };

  return (
    <div className="admin-chat-wrapper">
      <div className="admin-chat-header-container">
        <h2 className="admin-chat-header">Admin Chat</h2>
      </div>
      <div className="student-select-container">
        <label htmlFor="studentSelect" className="student-select-label">Select Student:</label>
        <select
          id="studentSelect"
          value={selectedStudent || ''}
          onChange={handleStudentChange}
          className="student-select-dropdown"
        >
          <option value="" disabled>Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
      <div className="chat-messages-container">
        {loading ? (
          <p className="loading-message">Loading messages...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.senderType === 'admin' ? 'chat-message-admin' : 'chat-message-student'}`}
            >
              <p className="chat-message-content">{msg.content}</p>
              <span className="chat-message-timestamp">{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p className="no-messages-message">No messages yet.</p>
        )}
        <div ref={messagesEndRef} /> {/* Reference element for scrolling */}
      </div>
      <form onSubmit={handleSendMessage} className="message-input-form">
        <textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-textarea"
        />
        <div className="buttons-container">
          <button
            type="submit"
            className="message-send-button"
          >
            Send
          </button>
          <button
            type="button"
            className="refresh-button"
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminChat;
