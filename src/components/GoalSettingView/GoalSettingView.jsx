import React, { useState, useEffect } from 'react';
import './GoalSettingView.css';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/Header';

const GoalSettingView = () => {
  const { studentId } = useParams();
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

  // Fetch goal-setting data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/goal-setting/student/${studentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Handle the case where data is an array
        if (Array.isArray(data) && data.length > 0) {
          const [goalData] = data; // Extract the first object from the array
          console.log('Fetched data:', goalData); // Log data to verify structure
          
          // Exclude or handle id field if not needed
          const { id, studentId, ...rest } = goalData;
          console.log('Processed goal data:', rest); // Log processed data
          setFormData(rest);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching goal setting data:', error);
      }
    };

    fetchData();
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

            {/* Arabic */}
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">1</div>
              <div className="goal-setting-cell goal-setting-cell-subject">ARABIC</div>
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

            {/* English */}
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

            {/* Hindi */}
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">3</div>
              <div className="goal-setting-cell goal-setting-cell-subject">HINDI</div>
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

            {/* Mathematics */}
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

            {/* Science & Technology */}
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">5</div>
              <div className="goal-setting-cell goal-setting-cell-subject">SCIENCE & TECHNOLOGY</div>
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

            {/* Social Studies */}
            <div className="goal-setting-row">
              <div className="goal-setting-cell goal-setting-cell-sr">6</div>
              <div className="goal-setting-cell goal-setting-cell-subject">SOCIAL STUDIES</div>
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
