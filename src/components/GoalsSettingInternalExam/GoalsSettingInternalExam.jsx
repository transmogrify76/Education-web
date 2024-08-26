import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../SideNav/SideNav';
import { FaTag } from 'react-icons/fa';
import './GoalsSettingInternalExam.css';
import Header from '../Header/Header'
const GoalsSettingInternalExam = () => {
  const { studentId } = useParams();
  const [formData, setFormData] = useState({
    arabic: {
      prevGrade: '',
      suggestedTarget: '',
      targetForThisGrade: ''
    },
    english: {
      prevGrade: '',
      suggestedTarget: '',
      targetForThisGrade: ''
    },
    hindi: {
      prevGrade: '',
      suggestedTarget: '',
      targetForThisGrade: ''
    },
    mathematics: {
      prevGrade: '',
      suggestedTarget: '',
      targetForThisGrade: ''
    },
    'science and technology': {
      prevGrade: '',
      suggestedTarget: '',
      targetForThisGrade: ''
    },
    'social studies': {
      prevGrade: '',
      suggestedTarget: '',
      targetForThisGrade: ''
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
    const dataToSubmit = {
      studentId,
      subjects: Object.keys(formData).map((subject) => ({
        name: subject,
        myAchievementsForPreviousGrade: formData[subject].prevGrade,
        suggestedTargetForCurrentGrade: formData[subject].suggestedTarget,
        myTargetForThisGrade: formData[subject].targetForThisGrade
      }))
    };
    fetch('http://localhost:3000/goal-setting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSubmit)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='for-header'>
      <Header/>
    <div className='side-with'>
      <Sidebar studentId={studentId} />
      <form onSubmit={handleSubmit}>
        <h1>Goals Settings Internal Exam</h1>
        <div className="table">
          <div className="table-header">
            <div className="header-cell-one">
              <FaTag /> Sr no
            </div>
            <div className="header-cell-two">
              <FaTag /> Subject
            </div>
            <div className="header-cell-three">
              <FaTag /> My achievement for previous grade
            </div>
            <div className="header-cell-four">
              <FaTag /> Suggested target for current grade
            </div>
            <div className="header-cell-five">
              <FaTag /> My target for this grade
            </div>
          </div>
          <div className="table-body">
            {Object.keys(formData).map((subject, index) => (
              <div className="table-row" key={subject}>
                <div className="table-cell">{index + 1}</div>
                <div className="table-cell">{subject.toUpperCase()}</div>
                <div className="table-cell">
                  <input
                    type="number"
                    name={`${subject}.prevGrade`}
                    value={formData[subject].prevGrade}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="table-cell">
                  <input
                    type="number"
                    name={`${subject}.suggestedTarget`}
                    value={formData[subject].suggestedTarget}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="table-cell">
                  <input
                    type="number"
                    name={`${subject}.targetForThisGrade`}
                    value={formData[subject].targetForThisGrade}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="button-g" type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default GoalsSettingInternalExam;
