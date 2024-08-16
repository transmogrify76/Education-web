import React, { useState, useEffect } from 'react';
import './NotificationPage.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await fetch('http://localhost:3000/notification');
    const data = await response.json();
    setNotifications(data);
  };

  const handlePost = async () => {
    await fetch('http://localhost:3000/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    setMessage('');
    fetchNotifications();
  };

  const handleUpdate = async (id) => {
    await fetch(`http://localhost:3000/notification/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage }),
    });
    setNewMessage('');
    setEditId(null);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/notification/${id}`, {
      method: 'DELETE',
    });
    fetchNotifications();
  };

  return (
    <div className="notification-page">
      <h1>Notification Management</h1>
      <div className="notification-form">
        <h2>Create Notification</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter notification message"
        />
        <button onClick={handlePost}>Post Notification</button>
      </div>
      <div className="notification-list">
        <h2>Notifications</h2>
        {notifications.map((notification) => (
          <div key={notification._id} className="notification-item">
            {editId === notification._id ? (
              <>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={() => handleUpdate(notification._id)}>Update</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{notification.message}</p>
                <button onClick={() => { setEditId(notification._id); setNewMessage(notification.message); }}>Edit</button>
                <button onClick={() => handleDelete(notification._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
