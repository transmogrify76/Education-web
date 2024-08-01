import React from 'react';
import './Student.css'; // Import CSS file for styling

const Student = () => {
  return (
    <div className="student-container">
      <header className="header">
        <h1>Welcome, Student</h1>
        <nav className="navbar">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Grades</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Logout</a></li>
          </ul>
        </nav>
      </header>
      <main className="main">
        <section className="course-list">
          <h2>My Courses</h2>
          <ul>
            <li>
              <h3>Course 1</h3>
              <p>Description of Course 1</p>
            </li>
            <li>
              <h3>Course 2</h3>
              <p>Description of Course 2</p>
            </li>
            <li>
              <h3>Course 3</h3>
              <p>Description of Course 3</p>
            </li>
          </ul>
        </section>
        <section className="grades">
          <h2>My Grades</h2>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Course 1</td>
                <td>A</td>
              </tr>
              <tr>
                <td>Course 2</td>
                <td>B</td>
              </tr>
              <tr>
                <td>Course 3</td>
                <td>C</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Student View</p>
      </footer>
    </div>
  );
}

export default Student;

