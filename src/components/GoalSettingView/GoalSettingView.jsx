import React, { useState, useEffect } from 'react';
import './GoalSettingView.css';
import SideNav from '../SideNav/SideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/Header';
import { jwtDecode } from 'jwt-decode';

const GoalSettingView = () => {
  const [formData, setFormData] = useState({
    arabicAchievement: '',
    arabicMyTarget: '',
    arabicSuggestedTarget: '',
    englishAchievement: '',
    englishMyTarget: '',
    englishSuggestedTarget: '',
    hindiAchievement: '',
    hindiMyTarget: '',
    hindiSuggestedTarget: '',
    mathematicsAchievement: '',
    mathematicsMyTarget: '',
    mathematicsSuggestedTarget: '',
    scienceAndTechnologyAchievement: '',
    scienceAndTechnologyMyTarget: '',
    scienceAndTechnologySuggestedTarget: '',
    socialStudiesAchievement: '',
    socialStudiesMyTarget: '',
    socialStudiesSuggestedTarget: '',
    myAchievementsForPreviousGrade: '',
    myTargetForThisGrade: '',
    suggestedTargetForCurrentGrade: ''
  });
  
  const [studentId, setStudentId] = useState(null); 
  useEffect(() => {
    
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setStudentId(decodedToken.Id); 
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
          

          if (Array.isArray(data) && data.length > 0) {
            const [goalData] = data; 
            console.log('Fetched data:', goalData); 
            
            const { id, studentId, ...rest } = goalData;
            console.log('Processed goal data:', rest); 
            setFormData(rest);
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
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">1</div>
              <div className="goal-setting-cell goal-setting-cell-subject">BENGALI</div>
              <div className="goal-setting-cell">
                <p>{formData.arabicAchievement}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.arabicSuggestedTarget}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.arabicMyTarget}</p>
              </div>
            </div>
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">2</div>
              <div className="goal-setting-cell goal-setting-cell-subject">ENGLISH</div>
              <div className="goal-setting-cell">
                <p>{formData.englishAchievement}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.englishSuggestedTarget}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.englishMyTarget}</p>
              </div>
            </div>
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">3</div>
              <div className="goal-setting-cell goal-setting-cell-subject">SCIENCE & TECHNOLOGY</div>
              <div className="goal-setting-cell">
                <p>{formData.hindiAchievement}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.hindiSuggestedTarget}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.hindiMyTarget}</p>
              </div>
            </div>
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">4</div>
              <div className="goal-setting-cell goal-setting-cell-subject">MATHEMATICS</div>
              <div className="goal-setting-cell">
                <p>{formData.mathematicsAchievement}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.mathematicsSuggestedTarget}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.mathematicsMyTarget}</p>
              </div>
            </div>
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">5</div>
              <div className="goal-setting-cell goal-setting-cell-subject">HISTORY</div>
              <div className="goal-setting-cell">
                <p>{formData.scienceAndTechnologyAchievement}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.scienceAndTechnologySuggestedTarget}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.scienceAndTechnologyMyTarget}</p>
              </div>
            </div>
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">6</div>
              <div className="goal-setting-cell goal-setting-cell-subject">GEOGRAPHY</div>
              <div className="goal-setting-cell">
                <p>{formData.socialStudiesAchievement}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.socialStudiesSuggestedTarget}</p>
              </div>
              <div className="goal-setting-cell">
                <p>{formData.socialStudiesMyTarget}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSettingView;
