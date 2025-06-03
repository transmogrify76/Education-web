import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import './AssignmentSubmissionPage.css'; // Make sure to add styles for the new elements
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';

const AssignmentSubmissionPage = () => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [content, setContent] = useState('');
  const [classroomLink, setClassroomLink] = useState('');
  const [student, setStudent] = useState(null); // State for student details
  const [studentClassId, setStudentClassId] = useState(''); // Store student’s class ID

  // Extract student details from JWT token
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the JWT token
      const { Id, studentName, enrollmentNo, rollNo, class: studentClass } = decodedToken; // Extract necessary details

      // Set student details from decoded token (as we have the required details already)
      setStudent({
        studentId: Id,
        studentName,
        enrollmentNo,
        rollNo,
        classId: studentClass.id,
        className: studentClass.className
      });

      // Set the student classId
      setStudentClassId(studentClass.id);
    }
  }, []);

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch assignments for the student's class automatically
  useEffect(() => {
    if (!studentClassId) return; // Don't fetch assignments if classId isn't available

    const fetchAssignmentsByClass = async () => {
      try {
        const response = await axios.get(`http://192.168.0.103:3000/assignments/class/${studentClassId}`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignmentsByClass();
  }, [studentClassId]);

  // Filter assignments by classId (this might not be necessary if we are directly fetching by studentClassId)
  useEffect(() => {
    if (studentClassId) {
      const filtered = assignments.filter(assignment => assignment.classId === studentClassId);
      setFilteredAssignments(filtered);
    } else {
      setFilteredAssignments([]); // Clear assignments if no class is selected
    }
  }, [studentClassId, assignments]);

  // Handle assignment change
  const handleAssignmentChange = (e) => {
    const selectedId = e.target.value;
    const assignment = filteredAssignments.find(a => a.id === Number(selectedId));
    setSelectedAssignment(assignment);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      content,
      studentId: student.studentId, // Use the decoded studentId
      classroomLink: classroomLink || '', // Ensure classroomLink is always sent as an empty string if not provided
    };

    try {
      await axios.post(`http://192.168.0.103:3000/assignments/${selectedAssignment.id}/submit`, formData);
      alert('Assignment submitted successfully!');
      setContent('');
      setClassroomLink('');
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment.');
    }
  };

  return (
    <div className="assignment-submission-page">
      <Header />
      <div className="for-navbar">
        <SideNav studentId={student?.studentId} />
        <div className="assignment-submission-container">
          <h1>Submit Assignment</h1>

          {/* {student && (
            <div className="student-details">
              <h3>Student Details</h3>
              <p><strong>Name:</strong> {student.studentName}</p>
              <p><strong>Enrollment Number:</strong> {student.enrollmentNo}</p>
              <p><strong>Roll Number:</strong> {student.rollNo}</p>
              <p><strong>Class:</strong> {student.className}</p>
            </div>
          )} */}

          {studentClassId && (
            <div className="assignment-dropdown-container">
              <label htmlFor="assignmentDropdown">Select Assignment:</label>
              <select
                id="assignmentDropdown"
                value={selectedAssignment ? selectedAssignment.id : ''}
                onChange={handleAssignmentChange}
              >
                <option value="">Select an assignment</option>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </option>
                  ))
                ) : (
                  <option value="">No assignments available for this class</option>
                )}
              </select>
            </div>
          )}

          {selectedAssignment && (
            <div className="assignment-details">
              <h3>Assignment Details</h3>
              <p><strong>Title:</strong> {selectedAssignment.title}</p>
              <p><strong>Description:</strong> {selectedAssignment.description}</p>
              <p><strong>Due Date:</strong> {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
              {selectedAssignment.classroomLink && (
                <div className="classroom-link">
                  <p><strong>Google Classroom Link:</strong></p>
                  <a href={selectedAssignment.classroomLink} target="_blank" rel="noopener noreferrer">
                    Join Google Classroom
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">Submission Content: </label>
              <label htmlFor="content_w">Please Write Your Name and Roll Number in this box first </label>
              <textarea
                id="content"
                value={`Name: ${student?.studentName || ''}\nEnrollment No: ${student?.enrollmentNo || ''}\nRoll No: ${student?.rollNo || ''}\n`}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="5"
                cols="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="classroomLink">Google Classroom Link:</label>
              <input
                type="url"
                id="classroomLink"
                placeholder="Enter Google Classroom Link"
                value={classroomLink}
                onChange={(e) => setClassroomLink(e.target.value)}
              />
            </div>

            <button type="submit">Submit Assignment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionPage;
