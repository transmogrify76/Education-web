import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadResults.css';
import Header from '../Header/Header';
const UploadResults = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch students from the API
    axios.get('http://localhost:3000/student')
      .then(response => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredStudents(
      students.filter(student =>
        student.name.toLowerCase().includes(query)
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedStudent || !year || !file) {
      alert('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('studentId', selectedStudent);
    formData.append('year', year);
    formData.append('file', file);

    axios.post('http://localhost:3000/results', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => alert('Result uploaded successfully!'))
      .catch(error => console.error('Error uploading result:', error));
  };

  return (
    <div>
      <Header/>
    <div className="upload-results-container">
      <h1>Upload Student Result</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="search">Search Student</label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by student name..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="student">Select Student</label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select a student</option>
            {filteredStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} (ID: {student.id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="text"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter the year"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload Result (PDF)</label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Upload</button>
      </form>
    </div>
    </div>
  );
};

export default UploadResults;
