import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AssignmentSubmissionPage.css'; // Make sure to add styles for the new elements
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';

const AssignmentSubmissionPage = () => {
  const { studentId } = useParams();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [content, setContent] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLink, setPdfLink] = useState('');
  const [assignmentPdfUrl, setAssignmentPdfUrl] = useState(''); // State for assignment PDF URL

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch assignments by class ID whenever selectedClassId changes
  useEffect(() => {
    if (!selectedClassId) return; // Do nothing if no class is selected

    const fetchAssignmentsByClass = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/assignments/class/${selectedClassId}`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignmentsByClass();
  }, [selectedClassId]);

  // Filter assignments whenever assignments data or selectedClassId changes
  useEffect(() => {
    if (selectedClassId) {
      const filtered = assignments.filter(assignment => assignment.classId === Number(selectedClassId));
      setFilteredAssignments(filtered);
    } else {
      setFilteredAssignments([]); // Clear assignments if no class is selected
    }
  }, [selectedClassId, assignments]);

  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
    setSelectedAssignment(null); // Clear selected assignment when class changes
  };

  const handleAssignmentChange = (e) => {
    const selectedId = e.target.value;
    const assignment = filteredAssignments.find(a => a.id === Number(selectedId));
    setSelectedAssignment(assignment);
    if (assignment) {
      setAssignmentPdfUrl(assignment.pdfUrl); // Set the PDF URL
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfLink(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('studentId', studentId);
    if (pdfFile) {
      formData.append('file', pdfFile);
    }

    try {
      await axios.post(`http://localhost:3000/assignments/${selectedAssignment.id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Assignment submitted successfully!');
      // Reset form fields
      setContent('');
      setPdfFile(null);
      setPdfLink('');
      setSelectedAssignment(null); // Reset selected assignment
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment.');
    }
  };

  return (
    <div className="assignment-submission-page">
      <Header />
      <div className="for-navbar">
        <SideNav studentId={studentId} />
        <div className="assignment-submission-container">
          <h1>Submit Assignment</h1>

          <div className="class-dropdown-container">
            <label htmlFor="classDropdown">Select a Class:</label>
            <select
              id="classDropdown"
              value={selectedClassId}
              onChange={handleClassChange}
            >
              <option value="">Select a class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.className} (ID: {classItem.id})
                </option>
              ))}
            </select>
          </div>

          {selectedClassId && (
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
              {assignmentPdfUrl && (
                <div className="pdf-url">
                  <p><strong>Assignment PDF:</strong></p>
                  <a href={assignmentPdfUrl} target="_blank" rel="noopener noreferrer">
                    View Assignment PDF
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">Submission Content:</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="5"
                cols="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pdfFile">Upload PDF:</label>
              <input
                type="file"
                id="pdfFile"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {pdfLink && (
                <div className="pdf-preview">
                  <a href={pdfLink} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </div>
              )}
            </div>

            <button type="submit">Submit Assignment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionPage;
