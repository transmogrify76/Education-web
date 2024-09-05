import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminBehaviorAssessment.css';

const AdminBehaviorAssessment = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');
  const [behavior, setBehavior] = useState('');
  const [cleanliness, setCleanliness] = useState('');
  const [hygiene, setHygiene] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [punctuality, setPunctuality] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch students from the behavior assessment endpoint
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/student');
        const studentList = response.data.map((entry) => ({
          id: entry.id,
          name: entry.name,
          enrollmentNo: entry.enrollmentNo,
        }));
        setStudents(studentList || []);
        setFilteredStudents(studentList || []);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students. Please ensure the server is running and the endpoint is correct.');
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on the search query
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(lowercasedQuery)
    );

    // Sort filtered students alphabetically
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudentId) {
      setError('Please select a student.');
      return;
    }

    const behaviorData = {
      studentId: selectedStudentId,
      week,
      year,
      behavior,
      cleanliness,
      hygiene,
      softSkills,
      punctuality,
    };

    try {
      await axios.post('http://localhost:3000/behavior-assessment', behaviorData);
      setSuccess('Behavior assessment submitted successfully!');
      setError('');
      // Reset form after successful submission
      setSearchQuery('');
      setSelectedStudentId('');
      setWeek('');
      setYear('');
      setBehavior('');
      setCleanliness('');
      setHygiene('');
      setSoftSkills('');
      setPunctuality('');
    } catch (err) {
      console.error('Error submitting behavior assessment:', err);
      setError('An error occurred while submitting the behavior assessment.');
      setSuccess('');
    }
  };

  return (
    <div className="admin-page-container">
      {/* <header className="header"> */}
        <h1 className="header-titl">Admin - Behavior Assessment</h1>
      {/* </header> */}
      <main className="main-content">
        <form onSubmit={handleSubmit} className="form-section">
          <div className="input-group">
            <label htmlFor="search">Search Student:</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name"
            />
            {filteredStudents.length > 0 && searchQuery && (
              <ul className="suggestions-dropdown">
                {filteredStudents.map((student) => (
                  <li
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setSearchQuery(student.name);
                    }}
                  >
                    {student.name} (ID: {student.enrollmentNo})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="student-select">Or Select Student:</label>
            <select
              id="student-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} (ID: {student.enrollmentNo})
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="week">Week:</label>
            <input
              type="text"
              id="week"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="year">Year:</label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="behavior">Behavior:</label>
            <input
              type="text"
              id="behavior"
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="cleanliness">Cleanliness:</label>
            <input
              type="text"
              id="cleanliness"
              value={cleanliness}
              onChange={(e) => setCleanliness(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="hygiene">Hygiene:</label>
            <input
              type="text"
              id="hygiene"
              value={hygiene}
              onChange={(e) => setHygiene(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="softSkills">Soft Skills:</label>
            <input
              type="text"
              id="softSkills"
              value={softSkills}
              onChange={(e) => setSoftSkills(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="punctuality">Punctuality:</label>
            <input
              type="text"
              id="punctuality"
              value={punctuality}
              onChange={(e) => setPunctuality(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-submit">Submit Assessment</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </main>
      <footer className="footers">
        <p className="footers-text">© 2024 Edu_Web. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminBehaviorAssessment;
