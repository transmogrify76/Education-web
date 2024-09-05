// src/components/AssignmentPostPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './AssignmentPostPage.css'; // For custom styling

const AssignmentPostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    if (pdfFile) {
      formData.append('file', pdfFile);
    }

    try {
      const response = await axios.post('http://localhost:3000/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Assignment created successfully!');
      // Optionally, reset form fields
      setTitle('');
      setDescription('');
      setDueDate('');
      setPdfFile(null);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment.');
    }
  };

  return (
    <div className="assignment-post-page">
      <h2>Create Assignment</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="pdf">Upload PDF:</label>
          <input
            type="file"
            id="pdf"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Create Assignment</button>
      </form>
    </div>
  );
};

export default AssignmentPostPage;
