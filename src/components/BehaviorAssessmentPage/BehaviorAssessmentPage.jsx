import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Import jwt-decode
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';
import './BehaviorAssessmentPage.css';

const BehaviorAssessmentPage = () => {
  const [behaviorData, setBehaviorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null); // State to store the decoded studentId

  useEffect(() => {
    const fetchBehaviorData = async () => {
      // Decode the authToken from localStorage
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const decodedToken = jwtDecode(authToken); // Decode the token
          setStudentId(decodedToken.Id); // Set the studentId from the token
        } catch (err) {
          setError('Failed to decode token');
          setLoading(false);
          return;
        }
      }

      if (!studentId) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://192.168.0.103:3000/behavior-assessment/student/${studentId}`);
        setBehaviorData(response.data || []);
      } catch (err) {
        setError(`Failed to fetch behavior data: ${err.response ? err.response.data.message : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBehaviorData();
  }, [studentId]); // Re-run the effect when studentId changes

  if (loading) return <p className="loading-message"></p>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className='for-header'>
        <Header/>
    <div className="behavior-tool-container">
      <SideNav studentId={studentId} />
      <div className="behavior-tool-main">
        <header className="behavior-tool-header">
          <h4 className="behavior-tool-title">Behavior Assessment</h4>
        </header>
        <main className="behavior-tool-main-content">
          {behaviorData.length > 0 ? (
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
            <p className="no-data-message">No behavior data available for this student.</p>
          )}
        </main>
        
      </div>
    </div>
    <footer className="behavior-tool-footer">
          <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default BehaviorAssessmentPage;
