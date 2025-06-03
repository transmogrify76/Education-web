import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubmittedAssignment.css';
import { jwtDecode } from 'jwt-decode';
import Header from '../Header/Header'


const SubmittedAssignment = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherId(decoded?.id);
      } catch (err) {
        console.error('Token decode error:', err);
        setError('Invalid token.');
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!teacherId) return;

      try {
        const response = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`);
        const teacherClasses = response.data.classes || [];

        // Sort by numeric part of className (e.g., "Class 1", "Class 2")
        teacherClasses.sort((a, b) => {
          const aNum = parseInt(a.className.match(/\d+/));
          const bNum = parseInt(b.className.match(/\d+/));
          return aNum - bNum;
        });

        setClasses(teacherClasses);
      } catch (err) {
        console.error('Error fetching teacher classes:', err);
        setError('Failed to fetch classes.');
      }
    };

    fetchTeacherClasses();
  }, [teacherId]);

  useEffect(() => {
    if (selectedClassId) {
      const fetchAssignments = async () => {
        try {
          const response = await axios.get(`http://192.168.0.103:3000/assignments/class/${selectedClassId}`);
          setAssignments(response.data);
        } catch (error) {
          setError('Failed to fetch assignments for the selected class.');
        }
      };
      fetchAssignments();
    }
  }, [selectedClassId]);

  return (
    <div>
      <Header/>

    <div className="submitted-assignment">
      <h1>Submitted Assignments</h1>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="class-select">Select Class:</label>
      <select
        id="class-select"
        value={selectedClassId || ""}
        onChange={(e) => setSelectedClassId(e.target.value)}
      >
        <option value="" disabled>Select a class</option>
        {classes.map((classItem) => (
          <option key={classItem.id} value={classItem.id}>
            {classItem.className || `Class ${classItem.id}`}
          </option>
        ))}
      </select>

      <div className="assignments">
        {assignments.length > 0 ? (
          [...assignments].reverse().map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <div className="left-side">
                <h2>{assignment.title}</h2>
                <p><strong>Description:</strong> {assignment.description}</p>
                <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                {assignment.classroomLink && (
                  <p className="classroom-link">
                    <strong>Classroom Link:</strong> 
                    <a href={assignment.classroomLink} target="_blank" rel="noopener noreferrer">
                      Open Link
                    </a>
                  </p>
                )}
              </div>

              <div className="right-side">
                <h3>Student Submissions</h3>
                {assignment.submissions.length > 0 ? (
                  assignment.submissions.map((submission) => (
                    <div key={submission.id} className="submission-card">
                      <p><strong>Submission Content:</strong> {submission.content}</p>
                      {submission.classroomLink && (
                        <p className="submission-link">
                          <strong>Classroom Link:</strong>
                          <a href={submission.classroomLink} target="_blank" rel="noopener noreferrer">
                            Open Link
                          </a>
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No submissions found for this assignment.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No assignments available.</p>
        )}
      </div>
    </div>
        </div>
  );
};

export default SubmittedAssignment;
