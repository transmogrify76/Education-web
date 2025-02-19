import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import axios from 'axios';
import './BehaviorAssessmentTool.css';
import Header from '../Header/Header';

const BehaviorAssessmentTool = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [behaviorData, setBehaviorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parentId, setParentId] = useState(null);

  // Decode the JWT token to get parentId from localStorage
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        setParentId(decodedToken.id); // Extract parentId from the decoded token
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setLoading(false);
      }
    } else {
      console.error('No authToken found in localStorage');
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  // Fetch students associated with the parentId
  useEffect(() => {
    if (parentId) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3000/parent/${parentId}`);
          setStudents(response.data.students || []);
        } catch (err) {
          setError(`Failed to fetch students: ${err.response ? err.response.data.message : err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [parentId]);

  // Fetch behavior data when a student is selected
  useEffect(() => {
    const fetchBehaviorData = async () => {
      if (!selectedStudentId) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/behavior-assessment/student/${selectedStudentId}`);
        setBehaviorData(response.data || []);
      } catch (err) {
        setError(`Failed to fetch behavior data: ${err.response ? err.response.data.message : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBehaviorData();
  }, [selectedStudentId]);

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
  };

  if (loading) return <p className="loading-message">Loading...</p>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <Header />
      <div className="behavior-container">
        <header className="behavior-tool-header">
          <h4 className="behavior-tool-title">Behavior Assessment Tool</h4>
        </header>
        <main className="behavior-tool-main">
          <div className="student-dropdown">
            <label htmlFor="student-select">Select Student:</label>
            <select id="student-select" value={selectedStudentId} onChange={handleStudentChange}>
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} (ID: {student.id})
                </option>
              ))}
            </select>
          </div>

          {selectedStudentId && behaviorData.length > 0 ? (
            <div className="behavior-data-container">
              {behaviorData.map((data) => (
                <div key={data.id} className="behavior-data-card">
                  {data.week && (
                    <div className="behavior-data-item week-item">
                      <h3>Week</h3>
                      <p>{data.week}</p>
                    </div>
                  )}
                  {data.year && (
                    <div className="behavior-data-item year-item">
                      <h3>Year</h3>
                      <p>{data.year}</p>
                    </div>
                  )}
                  {data.behavior && (
                    <div className="behavior-data-item behavior-item">
                      <h3>Behavior</h3>
                      <p>{data.behavior}</p>
                    </div>
                  )}
                  {data.cleanliness && (
                    <div className="behavior-data-item cleanliness-item">
                      <h3>Cleanliness</h3>
                      <p>{data.cleanliness}</p>
                    </div>
                  )}
                  {data.hygiene && (
                    <div className="behavior-data-item hygiene-item">
                      <h3>Hygiene</h3>
                      <p>{data.hygiene}</p>
                    </div>
                  )}
                  {data.softSkills && (
                    <div className="behavior-data-item soft-skills-item">
                      <h3>Soft Skills</h3>
                      <p>{data.softSkills}</p>
                    </div>
                  )}
                  {data.punctuality && (
                    <div className="behavior-data-item punctuality-item">
                      <h3>Punctuality</h3>
                      <p>{data.punctuality}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            selectedStudentId && <p className="no-data-message">No behavior data available for this student.</p>
          )}
        </main>
        <footer className="behavior-tool-footer">
          <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default BehaviorAssessmentTool;
