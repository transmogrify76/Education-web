import React, { useState } from 'react';
import './GoalSettingView.css';
import SideNav from '../SideNav/SideNav';

const GoalSettingView = () => {
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
    <div className="goal-setting-view">
        <SideNav/>
      <form onSubmit={handleSubmit} className="goal-setting-form">
        <div className='headerofgoal'>
        <h1>
            Goal Setting View Application
        </h1>
        </div>
        <table className="goal-setting-table">
          <thead>
            <tr>
              <th>Sr no</th>
              <th>Subject</th>
              <th>My previous grade target</th>
              <th>My achievement for previous grade</th>
              <th>Suggested target for current grade</th>
              <th>My target for this grade</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(formData).map((subject, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{subject.toUpperCase()}</td>
                <td>
                  <input
                    type="number"
                    name={`${subject}.prevGradeTarget`}
                    value={formData[subject].prevGradeTarget}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name={`${subject}.prevGradeAchievement`}
                    value={formData[subject].prevGradeAchievement}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name={`${subject}.suggestedTarget`}
                    value={formData[subject].suggestedTarget}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name={`${subject}.targetForThisGrade`}
                    value={formData[subject].targetForThisGrade}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default GoalSettingView;