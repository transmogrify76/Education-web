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
    arabic: {
      prevGradeTarget: 0,
      prevGradeAchievement: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    english: {
      prevGradeTarget: 0,
      prevGradeAchievement: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    hindi: {
      prevGradeTarget: 0,
      prevGradeAchievement: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    mathematics: {
      prevGradeTarget: 0,
      prevGradeAchievement: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    'science and technology': {
      prevGradeTarget: 0,
      prevGradeAchievement: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    'social studies': {
      prevGradeTarget: 0,
      prevGradeAchievement: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    }
  });

  useEffect(() => {
    // Fetch goal-setting data when component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/goal-setting/${studentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error fetching goal setting data:', error);
      }
    };

    fetchData();
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [subject, field] = name.split('.');
    setFormData((prevState) => ({
      ...prevState,
      [subject]: {
        ...prevState[subject],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., save the data to a backend or display a success message
  };

  return (
    <div className='goal-setting-view-container'>
      <Header />
      <div className="goal-setting-view">
        <SideNav studentId={studentId} />
        <form onSubmit={handleSubmit} className="goal-setting-form">
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
            {Object.keys(formData).map((subject, index) => (
              <div key={index} className="goal-setting-row">
                <div className="goal-setting-cell goal-setting-cell-sr">{index + 1}</div>
                <div className="goal-setting-cell goal-setting-cell-subject">{subject.toUpperCase()}</div>
                <div className="goal-setting-cell">
                  <input
                    type="number"
                    name={`${subject}.prevGradeAchievement`}
                    value={formData[subject].prevGradeAchievement || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="goal-setting-cell">
                  <input
                    type="number"
                    name={`${subject}.suggestedTarget`}
                    value={formData[subject].suggestedTarget || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="goal-setting-cell">
                  <input
                    type="number"
                    name={`${subject}.targetForThisGrade`}
                    value={formData[subject].targetForThisGrade || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalSettingView;
