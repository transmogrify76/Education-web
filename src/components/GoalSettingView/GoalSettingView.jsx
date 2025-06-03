import React, { useState, useEffect } from 'react';
import './GoalSettingView.css';
import SideNav from '../SideNav/SideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/Header';
import { jwtDecode } from 'jwt-decode';

const GoalSettingView = () => {
  const [subjectsData, setSubjectsData] = useState([]); // Stores subjects data dynamically from the API
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setStudentId(decodedToken.Id); // Get studentId from token
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://192.168.0.103:3000/goal-setting/student/${studentId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();

          // Assuming the response is an array of subjects
          if (Array.isArray(data) && data.length > 0) {
            console.log('Fetched data:', data);
            setSubjectsData(data);
          } else {
            console.error('Unexpected data format:', data);
          }
        } catch (error) {
          console.error('Error fetching goal setting data:', error);
        }
      };

      fetchData();
    }
  }, [studentId]);

  return (
    <div className='goal-setting-view-container'>
      <Header />
      <div className="goal-setting-view">
        <SideNav studentId={studentId} />
        <div className="goal-setting-data">
          <div className="goal-header">
            <h1>Goal Setting View Application</h1>
          </div>
          <div className="goal-setting-table">
            <div className="goal-setting-header">
              <div className="goal-setting-cell goal-setting-cell-sr">
                <FontAwesomeIcon className="tag-icon" icon={faTag} />
                <span className="text-blue">Sr no</span>
              </div>
              <div className="goal-setting-cell goal-setting-cell-subject">
                <FontAwesomeIcon className="tag-icon" icon={faTag} />
                <span className="text-green">Subject</span>
              </div>
              <div className="goal-setting-cell goal-setting-cell-prev-grade">
                <FontAwesomeIcon className="tag-icon" icon={faTag} />
                <span className="text-green">My achievement for previous grade</span>
              </div>
              <div className="goal-setting-cell goal-setting-cell-suggested-target">
                <FontAwesomeIcon className="tag-icon" icon={faTag} />
                <span className="text-blue">Suggested target for current grade</span>
              </div>
              <div className="goal-setting-cell goal-setting-cell-target-for-this-grade">
                <FontAwesomeIcon className="tag-icon" icon={faTag} />
                <span className="text-green">My target for this grade</span>
              </div>
            </div>

            {/* Dynamic rendering of subjects */}
            {subjectsData.map((subject, index) => (
              <div className="goal-setting-row" key={subject.id}>
                <div className="goal-setting-cell goal-setting-cell-sr">{index + 1}</div>
                <div className="goal-setting-cell goal-setting-cell-subject">{subject.subject.toUpperCase()}</div>
                <div className="goal-setting-cell">
                  <p>{subject.achievement}</p> {/* Display achievement for previous grade */}
                </div>
                <div className="goal-setting-cell">
                  <p>{subject.suggestedTarget}</p> {/* Display suggested target for current grade */}
                </div>
                <div className="goal-setting-cell">
                  <p>{subject.myTarget}</p> {/* Display my target for this grade */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSettingView;
