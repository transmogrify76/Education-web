import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignmentPostPage.css'; // For custom styling

const AssignmentPostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState(''); // Renamed from 'link' to 'pdfUrl'
  const [students, setStudents] = useState([]); // State to store fetched students
  const [selectedStudent, setSelectedStudent] = useState(''); // Selected student ID

  // Fetch the student list on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/student');
        setStudents(response.data); // Assuming response contains an array of students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      dueDate,
      pdfUrl: pdfUrl || null, // If no URL, send null
      studentId: selectedStudent, // Send selected student ID
    };

    try {
      const response = await axios.post('http://localhost:3000/assignments', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Assignment created successfully!');
      // Optionally, reset form fields
      setTitle('');
      setDescription('');
      setDueDate('');
      setPdfUrl('');
      setSelectedStudent(''); // Reset selected student
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment.');
    }
  };

  return (
    <div className="assignment-post-page">
      <h2>Create Assignment</h2>
      <form onSubmit={handleSubmit}>
        {/* Student Selection */}
        <div className="form-group">
          <label htmlFor="student">Select Student:</label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
          >
            <option value="" disabled>Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Due Date Input */}
        <div className="form-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        {/* PDF URL Input */}
        <div className="form-group">
          <label htmlFor="pdfUrl">PDF URL (link input field):</label>
          <input
            type="text"
            id="pdfUrl"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            className="link-input"
            placeholder="Enter PDF URL"
          />
        </div>

        <button type="submit">Create Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentPostPage;
