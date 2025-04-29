import React from 'react';
import './TeacherInstructionPage.css';

function TeacherInstructionPage() {
  return (
    <div className="instruction-page">
      <h1>📘 Teacher Dashboard Instructions</h1>
      <ul>
        <li>
          <strong>📤 Upload Assignment:</strong>
          Upload assignment links (Google Classroom or others) for your students by selecting the subject and class.
        </li>
        <li>
          <strong>📊 Upload Result:</strong>
          Select your class, academic year, and students, then enter marks for subjects you teach.
        </li>
        <li>
          <strong>💬 Communicate with Students/Parents:</strong>
          Create messages with a proper title and content by selecting the relevant class.
        </li>
        <li>
          <strong>📅 Event & Meeting Creation:</strong>
          Schedule student events or parent-teacher meetings and share relevant details.
        </li>
        <li>
          <strong>📚 Resource Creation:</strong>
          Upload study material and learning resources for the entire class.
        </li>
        <li>
          <strong>🏷️ Grade Submission:</strong>
          Assign grades to students based on submitted assignments.
        </li>
        <li>
          <strong>📥 View Submitted Assignments:</strong>
          Check student submissions for each assignment to review and provide feedback.
        </li>
        <li>
          <strong>📖 E-Book Upload:</strong>
          Upload e-books in PDF format specific to your subject and class.
        </li>
        <li>
          <strong>🎥 Google Meet Creation:</strong>
          Generate a Google Meet link and send it to students for virtual classes or discussions.
        </li>
        <li>
          <strong>📘 Add Subject to Class:</strong>
          Assign subjects to your respective classes for academic tracking.
        </li>
        <li>
          <strong>📝 Student Attendance:</strong>
          Mark daily attendance for your class and keep student records updated.
        </li>
      </ul>
    </div>
  );
}

export default TeacherInstructionPage;
