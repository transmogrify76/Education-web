import React from 'react';
import './ParentView.css'; 

const ParentView = () => {
  return (
    <div className="parent-view">
      <header className="header">
        <h1>Welcome, Parent</h1>
      </header>
      <main className="main">
        <section className="child-list">
          <h2>My Children</h2>
          <ul>
            <li>
              <h3>Child 1</h3>
              <p>Description of Child 1</p>
            </li>
            <li>
              <h3>Child 2</h3>
              <p>Description of Child 2</p>
            </li>
            <li>
              <h3>Child 3</h3>
              <p>Description of Child 3</p>
            </li>
          </ul>
        </section>
        <section className="events">
          <h2>Upcoming Events</h2>
          <ul>
            <li>
              <h3>Event 1</h3>
              <p>Date: 2024-06-10</p>
            </li>
            <li>
              <h3>Event 2</h3>
              <p>Date: 2024-06-15</p>
            </li>
            <li>
              <h3>Event 3</h3>
              <p>Date: 2024-06-20</p>
            </li>
          </ul>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Parent View</p>
      </footer>
    </div>
  );
}

export default ParentView;
