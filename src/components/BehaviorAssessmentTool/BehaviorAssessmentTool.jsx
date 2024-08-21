import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BehaviorAssessmentTool.css';

const BehaviorAssessmentTool = () => {
  const { parentId } = useParams(); // Get parentId from the URL
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [behaviorData, setBehaviorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students associated with the parentId
  useEffect(() => {
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

  if (loading) return <p className="loading">Loading...</p>;

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="header-title">Behavior Assessment Tool</h1>
      </header>
      <main className="main-content">
        <div className="dropdown-container">
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
          <div className="data-section">
            {behaviorData.map((data) => (
              <div key={data.id} className="data-card-container">
                {data.week && (
                  <div className="data-card week-card">
                    <h3>Week</h3>
                    <p>{data.week}</p>
                  </div>
                )}
                {data.year && (
                  <div className="data-card year-card">
                    <h3>Year</h3>
                    <p>{data.year}</p>
                  </div>
                )}
                {data.behavior && (
                  <div className="data-card behavior-card">
                    <h3>Behavior</h3>
                    <p>{data.behavior}</p>
                  </div>
                )}
                {data.cleanliness && (
                  <div className="data-card cleanliness-card">
                    <h3>Cleanliness</h3>
                    <p>{data.cleanliness}</p>
                  </div>
                )}
                {data.hygiene && (
                  <div className="data-card hygiene-card">
                    <h3>Hygiene</h3>
                    <p>{data.hygiene}</p>
                  </div>
                )}
                {data.softSkills && (
                  <div className="data-card soft-skills-card">
                    <h3>Soft Skills</h3>
                    <p>{data.softSkills}</p>
                  </div>
                )}
                {data.punctuality && (
                  <div className="data-card punctuality-card">
                    <h3>Punctuality</h3>
                    <p>{data.punctuality}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          selectedStudentId && <p className="no-data">No behavior data available for this student.</p>
        )}
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BehaviorAssessmentTool;
