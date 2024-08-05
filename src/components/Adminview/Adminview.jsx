import React from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <header className="header-one">
        <h1>Admin Panel</h1>
      </header>
      <nav className="sidebar">
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Users</a></li>
          <li><a href="#">Settings</a></li>
          <li><a href="#">Logs</a></li>
        </ul>
      </nav>
      <main className="content">
        <h2>Welcome, Admin!</h2>
        <p>This is your admin panel where you can manage users, settings, and view logs.</p>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Admin Panel</p>
      </footer>
    </div>
  );
}

export default AdminPanel;

