import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AssignmentSubmissionPage.css';

const AssignmentSubmissionPage = () => {
  const { studentId } = useParams(); // Get studentId from the URL params
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [content, setContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfLink, setPdfLink] = useState('');

  useEffect(() => {
    // Fetch all assignments when component mounts
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/assignments'); // Fetch all assignments
        const allAssignments = response.data;

        // Filter assignments based on the studentId
        const filteredAssignments = allAssignments.filter(
          (assignment) => assignment.studentId === Number(studentId)
        );
        setAssignments(filteredAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
  }, [studentId]); // Run this effect whenever the studentId changes

  const handleAssignmentChange = (e) => {
    const selectedId = e.target.value;
    const assignment = assignments.find((a) => a.id === Number(selectedId));
    setSelectedAssignment(assignment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createSubmissionDto = {
      content,
      studentId,
      pdfUrl: pdfUrl || null,
    };

    try {
      await axios.post(`http://localhost:3000/assignments/${selectedAssignment.id}/submit`, createSubmissionDto);
      alert(`Assignment submitted successfully! Student ID: ${studentId}`);
      // Optionally reset form fields
      setContent('');
      setPdfUrl('');
      setPdfLink('');
      setSelectedAssignment(null); // Reset selected assignment
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment.');
    }
  };

  return (
    <div className="assignment-submission-page">
      <h2>Submit Assignment</h2>
      <form onSubmit={handleSubmit}>
        {/* Assignment Selection Dropdown */}
        <div className="form-group">
          <label htmlFor="assignment">Select Assignment:</label>
          <select
            id="assignment"
            onChange={handleAssignmentChange}
            value={selectedAssignment ? selectedAssignment.id : ''}
            required
          >
            <option value="">Select an assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>

        {/* Display Assignment Details if Selected */}
        {selectedAssignment && (
          <div className="assignment-details">
            <h3>Assignment Details</h3>
            <p><strong>Title:</strong> {selectedAssignment.title}</p>
            <p><strong>Description:</strong> {selectedAssignment.description}</p>
            <p><strong>Due Date:</strong> {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
          </div>
        )}

        {/* Submission Content */}
        <div className="form-group">
          <label htmlFor="content">Submission Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* PDF URL Input */}
        <div className="form-group">
          <label htmlFor="pdfUrl">PDF URL:</label>
          <input
            type="text"
            id="pdfUrl"
            value={pdfUrl}
            onChange={(e) => {
              setPdfUrl(e.target.value);
              setPdfLink(e.target.value);
            }}
            className="link-input"
            placeholder="Enter PDF URL"
          />
          {pdfLink && (
            <a href={pdfLink} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          )}
        </div>

        <button type="submit">Submit Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentSubmissionPage;
